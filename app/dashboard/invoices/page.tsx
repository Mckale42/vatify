"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  Building,
  Calendar,
  DollarSign,
  Camera,
  Edit,
  Save,
  X,
} from "lucide-react"
import { useState, useRef } from "react"
import { SmartInvoiceCapture } from "@/components/smart-invoice-capture"

interface ProcessedInvoice {
  id?: string
  file: File
  status: "processing" | "success" | "error"
  data?: {
    supplier: string
    vatNumber: string
    invoiceNumber: string
    date: string
    totalAmount: number
    vatAmount: number | null // Allow null for VAT amount
    exclusiveAmount: number | null // Allow null for exclusive amount
    description: string
    notes?: string
  }
  error?: string
  isEditing?: boolean
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<ProcessedInvoice[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const newInvoices: ProcessedInvoice[] = Array.from(files).map((file) => ({
      file,
      status: "processing" as const,
    }))

    setInvoices((prev) => [...prev, ...newInvoices])

    // Process each file
    for (let i = 0; i < newInvoices.length; i++) {
      const invoice = newInvoices[i]
      await processInvoice(invoice.file, invoices.length + i)
    }
  }

  const processInvoice = async (file: File, index: number) => {
    try {
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        await new Promise((resolve) => setTimeout(resolve, 1100))
        const today = new Date().toISOString().slice(0, 10)
        const demoData = {
          supplier: "Acme Supplies (Pty) Ltd",
          vatNumber: "4123456789",
          invoiceNumber: `INV-${Math.floor(10000 + Math.random() * 89999)}`,
          date: today,
          totalAmount: 1250,
          vatAmount: 163.04,
          exclusiveAmount: 1086.96,
          description: "Office supplies and business consumables",
        }
        setInvoices((prev) => prev.map((inv, i) => i === index ? { ...inv, id: `demo-${Date.now()}`, status: "success" as const, data: demoData } : inv))
        return
      }

      // Step 1: Process with Gemini AI
      const formData = new FormData()
      formData.append("file", file)

      const processResponse = await fetch("/api/process-invoice", {
        method: "POST",
        body: formData,
      })

      const processResult = await processResponse.json()

      if (!processResult.success) {
        const errorMessage = processResult.retryable
          ? `${processResult.details} The invoice will remain in your list - you can try uploading it again later.`
          : processResult.details || processResult.error

        setInvoices((prev) =>
          prev.map((inv, i) =>
            i === index
              ? {
                  ...inv,
                  status: "error" as const,
                  error: errorMessage,
                }
              : inv,
          ),
        )
        return
      }

      // Step 2: Save to database
      const saveFormData = new FormData()
      saveFormData.append("file", file)
      saveFormData.append("extractedData", JSON.stringify(processResult.data))

      const saveResponse = await fetch("/api/save-invoice", {
        method: "POST",
        body: saveFormData,
      })

      const saveResult = await saveResponse.json()

      if (!saveResult.success) {
        setInvoices((prev) =>
          prev.map((inv, i) =>
            i === index
              ? {
                  ...inv,
                  status: "error" as const,
                  error: saveResult.details || saveResult.error,
                }
              : inv,
          ),
        )
        return
      }

      // Update status to success
      setInvoices((prev) =>
        prev.map((inv, i) =>
          i === index
            ? {
                ...inv,
                id: saveResult.data.id,
                status: "success" as const,
                data: processResult.data,
              }
            : inv,
        ),
      )
    } catch (error) {
      setInvoices((prev) =>
        prev.map((inv, i) =>
          i === index
            ? {
                ...inv,
                status: "error" as const,
                error: error instanceof Error ? error.message : "An unexpected error occurred",
              }
            : inv,
        ),
      )
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })

      setShowCamera(true)

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          streamRef.current = stream
          videoRef.current.play().catch((err) => {
            console.error("[v0] Error playing video:", err)
          })
        }
      }, 100)
    } catch (error) {
      console.error("[v0] Error accessing camera:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      alert(`Unable to access camera: ${errorMessage}. Please check permissions and ensure you're using HTTPS.`)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        alert("Camera is not ready yet. Please wait a moment and try again.")
        return
      }

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: "image/jpeg" })
              const dt = new DataTransfer()
              dt.items.add(file)
              handleFileSelect(dt.files)
            }
          },
          "image/jpeg",
          0.95,
        )
      }
      stopCamera()
    }
  }

  const toggleEdit = (index: number) => {
    setInvoices((prev) => prev.map((inv, i) => (i === index ? { ...inv, isEditing: !inv.isEditing } : inv)))
  }

  const updateInvoiceData = (index: number, field: string, value: string | number | null) => {
    setInvoices((prev) =>
      prev.map((inv, i) => {
        if (i === index && inv.data) {
          const updatedData = {
            ...inv.data,
            [field]: value,
          }

          if (field === "vatAmount" && value !== null && updatedData.totalAmount) {
            const vatAmount = typeof value === "number" ? value : Number.parseFloat(value as string)
            if (!Number.isNaN(vatAmount)) {
              updatedData.exclusiveAmount = updatedData.totalAmount - vatAmount
            }
          }

          if (field === "totalAmount" && value !== null && updatedData.vatAmount !== null) {
            const totalAmount = typeof value === "number" ? value : Number.parseFloat(value as string)
            const vatAmount = updatedData.vatAmount
            if (!Number.isNaN(totalAmount) && !Number.isNaN(vatAmount)) {
              updatedData.exclusiveAmount = totalAmount - vatAmount
            }
          }

          return {
            ...inv,
            data: updatedData,
          }
        }
        return inv
      }),
    )
  }

  const saveEdit = async (index: number) => {
    const invoice = invoices[index]
    if (!invoice.id || !invoice.data) return

    try {
      const response = await fetch("/api/update-invoice", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: invoice.id,
          ...invoice.data,
          notes: invoice.data.notes,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setInvoices((prev) => prev.map((inv, i) => (i === index ? { ...inv, isEditing: false } : inv)))
      } else {
        alert("Failed to save changes: " + result.error)
      }
    } catch (error) {
      console.error("Error saving invoice:", error)
      alert("Failed to save changes")
    }
  }

  const cancelEdit = (index: number) => {
    setInvoices((prev) => prev.map((inv, i) => (i === index ? { ...inv, isEditing: false } : inv)))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleClearAll = () => {
    setInvoices([])
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Upload & Process Invoices</h1>
        {invoices.length > 0 && (
          <Button variant="outline" onClick={handleClearAll}>
            Clear All
          </Button>
        )}
      </div>

      <SmartInvoiceCapture onFiles={handleFileSelect} />

      {/* Processing Status */}
      {invoices.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Processing Status</h2>

          <div className="grid gap-4">
            {invoices.map((invoice, index) => (
              <Card key={index} className="border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">{invoice.file.name}</h3>
                        {invoice.status === "processing" && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Processing
                          </Badge>
                        )}
                        {invoice.status === "success" && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Success
                          </Badge>
                        )}
                        {invoice.status === "error" && (
                          <Badge className="bg-red-100 text-red-800">
                            <XCircle className="mr-1 h-3 w-3" />
                            Error
                          </Badge>
                        )}
                        {invoice.status === "success" && !invoice.isEditing && (
                          <Button variant="ghost" size="sm" onClick={() => toggleEdit(index)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 mb-4">
                        <span className="font-medium">Size:</span> {(invoice.file.size / 1024 / 1024).toFixed(2)} MB
                      </div>

                      {invoice.status === "error" && invoice.error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm text-red-800">{invoice.error}</p>
                        </div>
                      )}

                      {invoice.status === "success" && invoice.data && !invoice.isEditing && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <Building className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">Supplier</span>
                            </div>
                            <p className="text-sm">{invoice.data.supplier}</p>
                            <p className="text-xs text-gray-500">VAT: {invoice.data.vatNumber}</p>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">Invoice Details</span>
                            </div>
                            <p className="text-sm">{invoice.data.invoiceNumber}</p>
                            <p className="text-xs text-gray-500">{invoice.data.date}</p>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <DollarSign className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">Amounts</span>
                            </div>
                            <p className="text-sm">Total: R{invoice.data.totalAmount.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">
                              VAT:{" "}
                              {invoice.data.vatAmount !== null
                                ? `R${invoice.data.vatAmount.toFixed(2)}`
                                : "Not specified"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Excl:{" "}
                              {invoice.data.exclusiveAmount !== null
                                ? `R${invoice.data.exclusiveAmount.toFixed(2)}`
                                : "Not specified"}
                            </p>
                          </div>
                        </div>
                      )}

                      {invoice.status === "success" && invoice.data && invoice.isEditing && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`supplier-${index}`}>Supplier</Label>
                              <Input
                                id={`supplier-${index}`}
                                value={invoice.data.supplier}
                                onChange={(e) => updateInvoiceData(index, "supplier", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`vatNumber-${index}`}>VAT Number</Label>
                              <Input
                                id={`vatNumber-${index}`}
                                value={invoice.data.vatNumber}
                                onChange={(e) => updateInvoiceData(index, "vatNumber", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`invoiceNumber-${index}`}>Invoice Number</Label>
                              <Input
                                id={`invoiceNumber-${index}`}
                                value={invoice.data.invoiceNumber}
                                onChange={(e) => updateInvoiceData(index, "invoiceNumber", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`date-${index}`}>Date</Label>
                              <Input
                                id={`date-${index}`}
                                type="date"
                                value={invoice.data.date}
                                onChange={(e) => updateInvoiceData(index, "date", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`totalAmount-${index}`}>Total Amount</Label>
                              <Input
                                id={`totalAmount-${index}`}
                                type="number"
                                step="0.01"
                                value={invoice.data.totalAmount}
                                onChange={(e) =>
                                  updateInvoiceData(index, "totalAmount", Number.parseFloat(e.target.value))
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor={`vatAmount-${index}`}>VAT Amount</Label>
                              <Input
                                id={`vatAmount-${index}`}
                                type="number"
                                step="0.01"
                                placeholder="Leave blank if not specified"
                                value={invoice.data.vatAmount !== null ? invoice.data.vatAmount : ""}
                                onChange={(e) =>
                                  updateInvoiceData(
                                    index,
                                    "vatAmount",
                                    e.target.value === "" ? null : Number.parseFloat(e.target.value),
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor={`exclusiveAmount-${index}`}>Exclusive Amount</Label>
                              <Input
                                id={`exclusiveAmount-${index}`}
                                type="number"
                                step="0.01"
                                placeholder="Leave blank if not specified"
                                value={invoice.data.exclusiveAmount !== null ? invoice.data.exclusiveAmount : ""}
                                onChange={(e) =>
                                  updateInvoiceData(
                                    index,
                                    "exclusiveAmount",
                                    e.target.value === "" ? null : Number.parseFloat(e.target.value),
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`notes-${index}`}>Additional Notes</Label>
                            <textarea
                              id={`notes-${index}`}
                              className="w-full min-h-[100px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Add any additional details or notes about this invoice..."
                              value={invoice.data.notes || ""}
                              onChange={(e) => updateInvoiceData(index, "notes", e.target.value)}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => cancelEdit(index)}>
                              <X className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                            <Button onClick={() => saveEdit(index)}>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {invoices.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
            <CardDescription>Process your invoices in three simple steps</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Upload your invoice documents (PDF, JPG, or PNG format)</li>
              <li>Our AI will automatically extract key information like supplier, amounts, and VAT</li>
              <li>Review the processed data and view summaries in the Processed Invoices page</li>
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
