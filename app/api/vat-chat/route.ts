import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import { checkRateLimit } from "@/lib/rate-limiter"

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// The system prompt for the VAT assistant
const SYSTEM_PROMPT = `
You are a South African VAT expert assistant for Vatify, a VAT claim processing application.
Your role is to help users with questions about VAT in South Africa, including:

- VAT registration requirements and processes
- VAT rates (standard 15%, zero-rated, exempt)
- What expenses are VAT claimable
- Documentation requirements for VAT claims
- VAT return filing deadlines and procedures
- Common VAT pitfalls and how to avoid them
- Best practices for VAT record keeping
- Recent changes to VAT legislation

Always provide accurate, up-to-date information based on South African tax laws.
Be concise but thorough, and use simple language where possible.
If you're unsure about something, acknowledge it and suggest where the user might find more information.
Always maintain a professional, helpful tone.

Important VAT facts to remember:
- Standard VAT rate in South Africa is 15%
- VAT returns are typically filed every 2 months
- Businesses must register for VAT if their taxable supplies exceed R1 million in any 12-month period
- Certain goods are zero-rated (0% VAT) including basic food items, fuel, and exports
- Proper tax invoices must include: supplier name, VAT number, invoice number, date, description, and VAT amount
- VAT claims require valid tax invoices as supporting documentation
- VAT can be claimed on business expenses but not on personal expenses
- SARS may require up to 5 years of VAT records during audits
`

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local-client"
    const rateLimit = checkRateLimit(`vat-chat-${ip}`, { limit: 20, windowMs: 60 * 1000 })
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a moment before sending another." },
        { status: 429 }
      )
    }

    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    })

    // Start a chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a South African VAT expert assistant." }],
        },
        {
          role: "model",
          parts: [{ text: "I'll be your South African VAT expert assistant. How can I help you today?" }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    })

    // Send the message to the model
    const result = await chat.sendMessage(SYSTEM_PROMPT + "\n\nUser question: " + message)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      success: true,
      response: text,
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      {
        error: "Failed to process your question",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
