"use server"

import { createServerClient } from "@/lib/supabase/server"

export type DocumentType =
  | "cipc_document"
  | "id_document"
  | "tax_clearance"
  | "power_of_attorney"
  | "proof_of_address"
  | "other_documents"

export async function uploadDocumentToStorage(documentType: DocumentType, formData: FormData) {
  try {
    console.log("[v0] Starting document upload for type:", documentType)

    const supabase = await createServerClient()
    console.log("[v0] Supabase client created, getting user...")

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Auth check result:", { hasUser: !!user, authError: authError?.message })

    if (authError || !user) {
      console.error("[v0] Authentication failed:", authError)
      return { success: false, error: "User not authenticated" }
    }

    const file = formData.get("file") as File
    if (!file) {
      console.error("[v0] No file provided in formData")
      return { success: false, error: "No file provided" }
    }

    console.log("[v0] File details:", { name: file.name, size: file.size, type: file.type })

    // Create file path: {user_id}/{document_type}/{timestamp}_{filename}
    const timestamp = Date.now()
    const fileExt = file.name.split(".").pop()
    const fileName = `${timestamp}_${documentType}.${fileExt}`
    const filePath = `${user.id}/${documentType}/${fileName}`

    console.log("[v0] Uploading to path:", filePath)

    // Upload file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage.from("documents").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      console.error("[v0] Error uploading file:", uploadError)
      return { success: false, error: "Failed to upload file" }
    }

    console.log("[v0] File uploaded successfully, getting public URL...")

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("documents").getPublicUrl(filePath)

    console.log("[v0] Public URL obtained:", publicUrl)

    // Save document URL to database
    const columnName = `${documentType}_url`

    // Check if user already has document uploads record
    const { data: existing } = await supabase.from("document_uploads").select("*").eq("user_id", user.id).maybeSingle()

    console.log("[v0] Existing record check:", { hasExisting: !!existing })

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("document_uploads")
        .update({
          [columnName]: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      if (updateError) {
        console.error("[v0] Error updating document URL:", updateError)
        return { success: false, error: "Failed to save document URL" }
      }
      console.log("[v0] Document URL updated in database")
    } else {
      // Insert new record
      const { error: insertError } = await supabase.from("document_uploads").insert({
        user_id: user.id,
        [columnName]: publicUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("[v0] Error inserting document URL:", insertError)
        return { success: false, error: "Failed to save document URL" }
      }
      console.log("[v0] Document URL inserted into database")
    }

    console.log("[v0] Upload completed successfully")
    return { success: true, url: publicUrl }
  } catch (error) {
    console.error("[v0] Error uploading document:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteDocumentFromStorage(documentType: DocumentType, fileUrl: string) {
  try {
    const supabase = await createServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Extract file path from URL
    const urlParts = fileUrl.split("/documents/")
    if (urlParts.length < 2) {
      return { success: false, error: "Invalid file URL" }
    }
    const filePath = urlParts[1]

    // Delete file from storage
    const { error: deleteError } = await supabase.storage.from("documents").remove([filePath])

    if (deleteError) {
      console.error("Error deleting file:", deleteError)
      return { success: false, error: "Failed to delete file" }
    }

    // Update database to remove URL
    const columnName = `${documentType}_url`
    const { error: updateError } = await supabase
      .from("document_uploads")
      .update({
        [columnName]: null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)

    if (updateError) {
      console.error("Error updating document URL:", updateError)
      return { success: false, error: "Failed to update database" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting document:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getUserDocumentsFromDB() {
  try {
    console.log("[v0] Fetching user documents from database...")

    const supabase = await createServerClient()
    console.log("[v0] Supabase client created, getting user...")

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Auth check result:", { hasUser: !!user, authError: authError?.message })

    if (authError || !user) {
      console.error("[v0] Authentication failed:", authError)
      return { success: false, error: "User not authenticated" }
    }

    console.log("[v0] Querying document_uploads table for user:", user.id)

    // Fetch user documents
    const { data, error } = await supabase.from("document_uploads").select("*").eq("user_id", user.id).maybeSingle()

    if (error) {
      console.error("[v0] Error fetching documents:", error)
      return { success: false, error: "Failed to fetch documents" }
    }

    console.log("[v0] Query result:", { hasData: !!data })

    if (!data) {
      console.log("[v0] No documents found for user")
      return { success: true, documents: null }
    }

    // Transform data to match expected format
    const documents: Record<DocumentType, { url: string; uploadedAt: string } | null> = {
      cipc_document: data.cipc_document_url ? { url: data.cipc_document_url, uploadedAt: data.updated_at } : null,
      id_document: data.id_document_url ? { url: data.id_document_url, uploadedAt: data.updated_at } : null,
      tax_clearance: data.tax_clearance_url ? { url: data.tax_clearance_url, uploadedAt: data.updated_at } : null,
      power_of_attorney: data.power_of_attorney_url
        ? { url: data.power_of_attorney_url, uploadedAt: data.updated_at }
        : null,
      proof_of_address: data.proof_of_address_url
        ? { url: data.proof_of_address_url, uploadedAt: data.updated_at }
        : null,
      other_documents: data.other_documents_url ? { url: data.other_documents_url, uploadedAt: data.updated_at } : null,
    }

    console.log("[v0] Documents fetched successfully")
    return { success: true, documents }
  } catch (error) {
    console.error("[v0] Error fetching documents:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
