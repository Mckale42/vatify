import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest) {
  try {
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
          details: "You must be logged in to update invoices",
        },
        { status: 401 },
      )
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing invoice ID",
          details: "Invoice ID is required",
        },
        { status: 400 },
      )
    }

    const { data, error: dbError } = await supabase
      .from("user_invoices")
      .update({
        supplier_name: updateData.supplier,
        supplier_vat_number: updateData.vatNumber,
        invoice_number: updateData.invoiceNumber,
        invoice_date: updateData.date,
        total_amount: updateData.totalAmount,
        vat_amount: updateData.vatAmount,
        net_amount: updateData.exclusiveAmount,
        processing_notes: updateData.notes,
        extracted_data: updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update invoice",
          details: dbError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error updating invoice:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update invoice",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
