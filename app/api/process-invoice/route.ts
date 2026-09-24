import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { checkRateLimit } from "@/lib/rate-limiter"

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

async function generateContentWithRetry(model: any, content: any[], maxRetries = 3) {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await model.generateContent(content)
      return result
    } catch (error: any) {
      lastError = error

      // Check if it's a 503 error (service unavailable)
      if (error?.message?.includes("503") || error?.message?.includes("overloaded")) {
        // Wait before retrying with exponential backoff
        const waitTime = Math.pow(2, attempt) * 1000 // 1s, 2s, 4s
        console.log(`[v0] API overloaded, retrying in ${waitTime}ms (attempt ${attempt + 1}/${maxRetries})`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      // For other errors, throw immediately
      throw error
    }
  }

  // If all retries failed, throw the last error
  throw lastError
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local-client"
    const rateLimit = checkRateLimit(`process-invoice-${ip}`, { limit: 10, windowMs: 60 * 1000 })
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again in 1 minute.",
          code: "RATE_LIMIT_EXCEEDED",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "API key not configured",
          details: "Please add GEMINI_API_KEY to your environment variables",
        },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file provided",
          details: "Please upload a file to process",
        },
        { status: 400 },
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")

    // Use Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `Analyze this invoice or receipt image and extract the following information in JSON format:
    {
      "supplier": "string (company/vendor name)",
      "vatNumber": "string (VAT registration number if available, otherwise null)",
      "invoiceNumber": "string (invoice or receipt number)",
      "date": "string (YYYY-MM-DD format)",
      "totalAmount": number (total amount including VAT),
      "vatAmount": number or null (VAT amount - ONLY if explicitly shown on the document, otherwise null),
      "exclusiveAmount": number or null (amount excluding VAT - ONLY if explicitly shown, otherwise null),
      "description": "string (brief description of items/services)"
    }
    
    Important:
    - If this is not an invoice or receipt, respond with: {"notAnInvoice": true}
    - For vatAmount and exclusiveAmount: ONLY extract if explicitly shown on the document
    - If VAT is not shown on the document, set vatAmount to null
    - If exclusive amount is not shown, set exclusiveAmount to null
    - Do NOT calculate or assume VAT amounts - only extract what is visible
    - If any other field is not found, use null for strings or 0 for numbers
    - Ensure the JSON is valid and properly formatted
    - Extract all visible text for the description field`

    const result = await generateContentWithRetry(model, [
      prompt,
      {
        inlineData: {
          mimeType: file.type,
          data: base64,
        },
      },
    ])

    const response = await result.response
    const text = response.text()

    let jsonData
    try {
      // Try to parse the response directly as JSON
      jsonData = JSON.parse(text)
    } catch (parseError) {
      // If direct parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        try {
          jsonData = JSON.parse(jsonMatch[1])
        } catch (innerError) {
          console.error("Failed to parse extracted JSON:", innerError)
          return NextResponse.json(
            {
              success: false,
              error: "Failed to extract invoice data",
              details: "The AI could not parse the document structure. Please ensure the image is clear and readable.",
            },
            { status: 400 },
          )
        }
      } else {
        console.error("No JSON found in response:", text)
        return NextResponse.json(
          {
            success: false,
            error: "Invalid document format",
            details: "Could not extract structured data from the image. Please upload a clearer image.",
          },
          { status: 400 },
        )
      }
    }

    if (jsonData.notAnInvoice) {
      return NextResponse.json(
        {
          success: false,
          error: "Not a valid invoice",
          details: "The uploaded image does not appear to be an invoice or receipt. Please upload a valid document.",
        },
        { status: 400 },
      )
    }

    const requiredFields = ["supplier", "invoiceNumber", "date", "totalAmount"]
    const missingFields = requiredFields.filter((field) => !jsonData[field] || jsonData[field] === null)

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Incomplete invoice data",
          details: `Missing required fields: ${missingFields.join(", ")}. Please upload a clearer image with all invoice details visible.`,
        },
        { status: 400 },
      )
    }

    const totalAmount = Number(jsonData.totalAmount) || 0
    const vatAmount =
      jsonData.vatAmount !== null && jsonData.vatAmount !== undefined ? Number(jsonData.vatAmount) : null
    const exclusiveAmount =
      jsonData.exclusiveAmount !== null && jsonData.exclusiveAmount !== undefined
        ? Number(jsonData.exclusiveAmount)
        : vatAmount !== null
          ? totalAmount - vatAmount
          : null

    return NextResponse.json({
      success: true,
      data: {
        supplier: jsonData.supplier || "Unknown",
        vatNumber: jsonData.vatNumber || "N/A",
        invoiceNumber: jsonData.invoiceNumber || "N/A",
        date: jsonData.date || new Date().toISOString().split("T")[0],
        totalAmount: totalAmount,
        vatAmount: vatAmount,
        exclusiveAmount: exclusiveAmount,
        description: jsonData.description || "No description available",
      },
    })
  } catch (error: any) {
    console.error("Error processing invoice:", error)

    if (error?.message?.includes("503") || error?.message?.includes("overloaded")) {
      return NextResponse.json(
        {
          success: false,
          error: "Service temporarily unavailable",
          details: "The AI service is currently experiencing high demand. Please try again in a few moments.",
          retryable: true,
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Processing failed",
        details: error instanceof Error ? error.message : "An unexpected error occurred while processing the invoice",
      },
      { status: 500 },
    )
  }
}
