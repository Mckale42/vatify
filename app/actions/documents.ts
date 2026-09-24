"use server"

import {
  uploadDocumentToStorage,
  deleteDocumentFromStorage,
  getUserDocumentsFromDB,
  type DocumentType,
} from "./storage"

export interface UploadResponse {
  success: boolean
  url?: string
  error?: string
}

export async function uploadDocument(documentType: DocumentType, formData: FormData): Promise<UploadResponse> {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Invalid file type. Please upload JPG, PNG, or PDF files." }
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return { success: false, error: "File size too large. Please upload files smaller than 10MB." }
    }

    // Upload to Supabase storage
    const result = await uploadDocumentToStorage(documentType, formData)

    return result
  } catch (error) {
    console.error("Upload error:", error)
    return {
      success: false,
      error: "Upload failed. Please try again.",
    }
  }
}

export async function deleteDocument(
  documentType: DocumentType,
  url: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await deleteDocumentFromStorage(documentType, url)
    return result
  } catch (error) {
    console.error("Delete error:", error)
    return {
      success: false,
      error: "Failed to delete document. Please try again.",
    }
  }
}

export async function getUserDocuments(): Promise<{
  success: boolean
  documents?: Record<DocumentType, { url: string; uploadedAt: string } | null> | null
  error?: string
}> {
  try {
    const result = await getUserDocumentsFromDB()
    return result
  } catch (error) {
    console.error("Fetch documents error:", error)
    return {
      success: false,
      error: "Failed to fetch documents.",
    }
  }
}
