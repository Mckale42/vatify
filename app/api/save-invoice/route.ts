import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { checkRateLimit } from "@/lib/rate-limiter"
import { validateInvoiceIntegrity, validateSarsInvoiceCompliance } from "@/lib/services/vat-calculator"

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local-client"
    const rateLimit = checkRateLimit(`save-invoice-${ip}`, { limit: 30, windowMs: 60 * 1000 })
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many save requests. Please try again later.",
          code: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 }
      )
    }

    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          details: "You must be logged in to save invoices",
        },
        { status: 401 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const extractedDataStr = formData.get("extractedData") as string

    if (!file || !extractedDataStr) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required data",
          details: "File and extracted data are required",
        },
        { status: 400 },
      )
    }

    const extractedData = JSON.parse(extractedDataStr)

    const arrayBuffer = await file.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: file.type })

    // Create file path: {user_id}/invoices/{filename}
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filePath = `${user.id}/invoices/${timestamp}_${sanitizedFileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage.from("documents").upload(filePath, blob, {
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      console.error("Storage upload error:", uploadError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to upload file",
          details: uploadError.message,
        },
        { status: 500 },
      )
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(filePath)

    const fileUrl = urlData.publicUrl

    const net = Number(extractedData.exclusiveAmount || 0)
    const vat = Number(extractedData.vatAmount || 0)
    const total = Number(extractedData.totalAmount || 0)

    const integrityCheck = validateInvoiceIntegrity(net, vat, total)
    const complianceCheck = validateSarsInvoiceCompliance({
      invoiceNumber: extractedData.invoiceNumber,
      invoiceDate: extractedData.date,
      supplierName: extractedData.supplier,
      supplierVatNumber: extractedData.vatNumber,
      totalAmount: total,
      vatAmount: vat,
    })

    const invoiceStatus = !integrityCheck.isValid ? "requires_review" : "processed"
    const validationNotes = [
      extractedData.notes,
      integrityCheck.reason,
      complianceCheck.missingRequirements.length > 0
        ? `SARS Warning: ${complianceCheck.missingRequirements.join(", ")}`
        : null,
    ]
      .filter(Boolean)
      .join(" | ")

    const { data: invoice, error: dbError } = await supabase
      .from("user_invoices")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_url: fileUrl,
        file_size: file.size,
        invoice_number: extractedData.invoiceNumber,
        invoice_date: extractedData.date,
        supplier_name: extractedData.supplier,
        supplier_vat_number: extractedData.vatNumber,
        total_amount: total,
        vat_amount: vat,
        net_amount: net,
        currency: "ZAR",
        extracted_data: extractedData,
        status: invoiceStatus,
        processing_notes: validationNotes || null,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      await supabase.storage.from("documents").remove([filePath])

      return NextResponse.json(
        {
          success: false,
          error: "Failed to save invoice",
          details: dbError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: invoice,
    })
  } catch (error) {
    console.error("Error saving invoice:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save invoice",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
