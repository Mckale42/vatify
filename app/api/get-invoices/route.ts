import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
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
