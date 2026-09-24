"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileCheck, AlertCircle, Trash2, Camera, Eye } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ImageCapture } from "@/components/image-capture"
import { uploadDocument, deleteDocument, getUserDocuments } from "@/app/actions/documents"
import type { DocumentType } from "@/app/actions/storage"

interface DocumentState {
  file: File | null
  status: "idle" | "uploading" | "success" | "error"
  progress: number
  error?: string
  url?: string
  uploadedAt?: string
}

export default function DocumentsPage() {
  const fileInputRefs = useRef<Record<DocumentType, HTMLInputElement | null>>({
    cipc_document: null,
    id_document: null,
    tax_clearance: null,
    power_of_attorney: null,
    proof_of_address: null,
    other_documents: null,
  })

  const [documents, setDocuments] = useState<Record<DocumentType, DocumentState>>({
    cipc_document: { file: null, status: "idle", progress: 0 },
    id_document: { file: null, status: "idle", progress: 0 },
    tax_clearance: { file: null, status: "idle", progress: 0 },
    power_of_attorney: { file: null, status: "idle", progress: 0 },
    proof_of_address: { file: null, status: "idle", progress: 0 },
    other_documents: { file: null, status: "idle", progress: 0 },
  })

  const [isLoading, setIsLoading] = useState(true)

  const documentLabels: Record<DocumentType, string> = {
    cipc_document: "CIPC Document",
    id_document: "ID Document",
    tax_clearance: "Tax Clearance Certificate",
    power_of_attorney: "Power of Attorney",
    proof_of_address: "Proof of Address",
    other_documents: "Other Supporting Documents",
  }

  const documentDescriptions: Record<DocumentType, string> = {
    cipc_document: "Company registration certificate from CIPC",
    id_document: "Copy of ID or passport of authorized representative",
    tax_clearance: "Valid tax clearance certificate from SARS",
    power_of_attorney: "If acting on behalf of the company",
    proof_of_address: "Recent utility bill or bank statement (not older than 3 months)",
    other_documents: "Any additional supporting documents",
  }

  // Load existing documents on component mount
  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true)
      try {
        const result = await getUserDocuments()
        if (result.success && result.documents) {
          setDocuments((prev) => {
            const updated = { ...prev }
            Object.entries(result.documents!).forEach(([type, doc]) => {
              if (doc) {
                updated[type as DocumentType] = {
                  file: null,
                  status: "success",
                  progress: 100,
                  url: doc.url,
                  uploadedAt: doc.uploadedAt,
                }
              }
            })
            return updated
          })
        }
      } catch (error) {
        console.error("Failed to load documents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDocuments()
  }, [])

  const handleFileChange = (type: DocumentType, file: File | null) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        file,
        status: file ? "idle" : prev[type].status,
        progress: file ? 0 : prev[type].progress,
        error: undefined,
      },
    }))
  }

  const handleFileInputChange = (type: DocumentType, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    handleFileChange(type, file)
    // Reset the input value so the same file can be selected again
    if (fileInputRefs.current[type]) {
      fileInputRefs.current[type]!.value = ""
    }
  }

  const handleBrowseClick = (type: DocumentType) => {
    fileInputRefs.current[type]?.click()
  }

  const handleImageCapture = (type: DocumentType, file: File) => {
    handleFileChange(type, file)
  }

  const handleUpload = async (type: DocumentType) => {
    const file = documents[type].file
    if (!file) return

    // Set uploading state
    setDocuments((prev) => ({
      ...prev,
      [type]: { ...prev[type], status: "uploading", progress: 0 },
    }))

    // Create progress simulation
    const progressInterval = setInterval(() => {
      setDocuments((prev) => {
        const currentProgress = prev[type].progress
        if (currentProgress >= 90) {
          return prev // Stop at 90% until actual upload completes
        }
        return {
          ...prev,
          [type]: { ...prev[type], progress: Math.min(currentProgress + 10, 90) },
        }
      })
    }, 200)

    try {
      // Create FormData for upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("documentType", type)

      // Upload the file
      const result = await uploadDocument(type, formData)

      clearInterval(progressInterval)

      if (result.success) {
        setDocuments((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            status: "success",
            progress: 100,
            url: result.url,
            uploadedAt: new Date().toISOString(),
            file: null, // Clear the file after successful upload
          },
        }))
      } else {
        setDocuments((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            status: "error",
            progress: 0,
            error: result.error || "Upload failed",
          },
        }))
      }
    } catch (error) {
      clearInterval(progressInterval)
      setDocuments((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          status: "error",
          progress: 0,
          error: "Upload failed. Please try again.",
        },
      }))
    }
  }

  const handleDelete = async (type: DocumentType) => {
    const doc = documents[type]
    if (!doc.url) return

    if (!confirm("Are you sure you want to delete this document?")) {
      return
    }

    try {
      const result = await deleteDocument(type, doc.url)

      if (result.success) {
        setDocuments((prev) => ({
          ...prev,
          [type]: { file: null, status: "idle", progress: 0 },
        }))
      } else {
        alert(result.error || "Failed to delete document")
      }
    } catch (error) {
      alert("Failed to delete document. Please try again.")
    }
  }

  const handleRemove = (type: DocumentType) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        file: null,
        status: prev[type].url ? "success" : "idle",
        progress: prev[type].url ? 100 : 0,
      },
    }))
  }

  const renderDocumentUploader = (type: DocumentType) => {
    const { file, status, progress, error, url, uploadedAt } = documents[type]
    const label = documentLabels[type]
    const description = documentDescriptions[type]
    const hasUploadedDocument = status === "success" && url

    return (
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="text-primary">{label}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "error" && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Show uploaded document */}
          {hasUploadedDocument && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Document uploaded successfully</p>
                    {uploadedAt && (
                      <p className="text-xs text-green-600">Uploaded: {new Date(uploadedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => window.open(url, "_blank")} title="View document">
                    <Eye className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(type)} title="Delete document">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Show current file being prepared for upload */}
          {file && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemove(type)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              {/* Show image preview if it's an image file */}
              {file.type.startsWith("image/") && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt="Document preview"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
              )}

              {status === "uploading" && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-gray-500 text-right">{progress}%</p>
                </div>
              )}

              {status === "idle" && (
                <Button onClick={() => handleUpload(type)} className="w-full bg-primary hover:bg-primary/90">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              )}
            </div>
          )}

          {/* Show upload options when no file is selected and no document is uploaded */}
          {!file && !hasUploadedDocument && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-accent/30 rounded-lg p-6">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Drag and drop your file here, or use the options below</p>
                <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 10MB)</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Hidden file input */}
                <input
                  ref={(el) => {
                    fileInputRefs.current[type] = el
                  }}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileInputChange(type, e)}
                />

                {/* File Upload Button */}
                <Button variant="outline" className="w-full bg-transparent" onClick={() => handleBrowseClick(type)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>

                {/* Camera Capture Button */}
                <ImageCapture onCapture={(file) => handleImageCapture(type, file)}>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                </ImageCapture>
              </div>
            </div>
          )}

          {/* Show replace option for uploaded documents */}
          {hasUploadedDocument && !file && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-3">Want to replace this document?</p>
              <div className="grid grid-cols-2 gap-3">
                {/* Hidden file input for replacement */}
                <input
                  ref={(el) => {
                    fileInputRefs.current[`replace-${type}` as DocumentType] = el
                  }}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileInputChange(type, e)}
                />

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => handleBrowseClick(type)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New
                </Button>

                <ImageCapture onCapture={(file) => handleImageCapture(type, file)}>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Camera className="mr-2 h-4 w-4" />
                    Take New Photo
                  </Button>
                </ImageCapture>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Required Documents</h1>
        <p className="text-gray-600 mt-2">
          Please upload the following documents to complete your profile and enable VAT claim processing. You can upload
          files or take photos directly with your camera.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.keys(documents).map((type) => renderDocumentUploader(type as DocumentType))}
      </div>

      <div className="mt-8">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            <strong>Note:</strong> All documents are securely encrypted and stored. Only authorized Vatify staff can
            access your documents for verification purposes.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
