import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
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
          details: "You must be logged in to delete invoices",
        },
        { status: 401 },
      )
    }

    const { searchParams } = new URL(request.url)
    const invoiceId = searchParams.get("id")

    if (!invoiceId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing invoice ID",
          details: "Invoice ID is required",
        },
        { status: 400 },
      )
    }

    const { data: invoice, error: fetchError } = await supabase
      .from("user_invoices")
      .select("file_url")
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !invoice) {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice not found",
          details: fetchError?.message || "Invoice does not exist",
        },
        { status: 404 },
      )
    }

    if (invoice.file_url && invoice.file_url.includes("/documents/")) {
      const urlParts = invoice.file_url.split("/documents/")
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        const { error: storageError } = await supabase.storage.from("documents").remove([filePath])

        if (storageError) {
          console.error("Storage deletion error:", storageError)
          // Continue with database deletion even if storage deletion fails
        }
      }
    }

    // Delete the invoice from the database
    const { error: dbError } = await supabase.from("user_invoices").delete().eq("id", invoiceId).eq("user_id", user.id)

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete invoice",
          details: dbError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Invoice deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting invoice:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete invoice",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
