import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  if (process.env.VATIFY_DEMO_MODE === "true") {
    const demoInvoices = [
      { id: "demo-1042", user_id: "demo-user", file_name: "acme-invoice-1042.pdf", file_url: "#", file_size: 184320, invoice_number: "INV-1042", invoice_date: "2026-09-14", due_date: null, supplier_name: "Acme Supplies (Pty) Ltd", supplier_address: "Johannesburg", supplier_vat_number: "4123456789", total_amount: 12500, vat_amount: 1630.43, net_amount: 10869.57, currency: "ZAR", line_items: null, extracted_data: null, status: "processed", processing_notes: null, created_at: "2026-09-14T09:30:00Z", updated_at: "2026-09-14T09:30:00Z" },
      { id: "demo-1039", user_id: "demo-user", file_name: "office-supplies-1039.jpg", file_url: "#", file_size: 245760, invoice_number: "INV-1039", invoice_date: "2026-09-12", due_date: null, supplier_name: "OfficeHub", supplier_address: "Pretoria", supplier_vat_number: "4987654321", total_amount: 6850, vat_amount: 893.48, net_amount: 5956.52, currency: "ZAR", line_items: null, extracted_data: null, status: "processed", processing_notes: null, created_at: "2026-09-12T10:15:00Z", updated_at: "2026-09-12T10:15:00Z" },
      { id: "demo-1038", user_id: "demo-user", file_name: "software-1038.pdf", file_url: "#", file_size: 132100, invoice_number: "INV-1038", invoice_date: "2026-09-10", due_date: null, supplier_name: "CloudWorks", supplier_address: "Cape Town", supplier_vat_number: "4876543210", total_amount: 2430, vat_amount: 316.96, net_amount: 2113.04, currency: "ZAR", line_items: null, extracted_data: null, status: "processed", processing_notes: null, created_at: "2026-09-10T08:00:00Z", updated_at: "2026-09-10T08:00:00Z" },
      { id: "demo-1037", user_id: "demo-user", file_name: "marketing-1037.png", file_url: "#", file_size: 329100, invoice_number: "INV-1037", invoice_date: "2026-09-08", due_date: null, supplier_name: "Bright Media", supplier_address: "Durban", supplier_vat_number: "4765432109", total_amount: 4120, vat_amount: 537.39, net_amount: 3582.61, currency: "ZAR", line_items: null, extracted_data: null, status: "processed", processing_notes: null, created_at: "2026-09-08T12:20:00Z", updated_at: "2026-09-08T12:20:00Z" },
    ]
    const status = new URL(request.url).searchParams.get("status")
    return NextResponse.json({ success: true, data: status ? demoInvoices.filter((invoice) => invoice.status === status) : demoInvoices })
  }

  try {
    const supabase = await createServerClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          details: "You must be logged in to view invoices",
        },
        { status: 401 },
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    // Build query
    let query = supabase
      .from("user_invoices")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    // Filter by status if provided
    if (status) {
      query = query.eq("status", status)
    }

    const { data: invoices, error: dbError } = await query

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch invoices",
          details: dbError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: invoices || [],
    })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch invoices",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
