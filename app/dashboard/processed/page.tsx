"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, FileText, Building, Calendar, DollarSign, Trash2, Edit, Save, X } from "lucide-react"
import { useState, useEffect } from "react"
import type { UserInvoice } from "@/lib/types/database"

export default function ProcessedPage() {
  const [processedInvoices, setProcessedInvoices] = useState<UserInvoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<UserInvoice>>({})

  useEffect(() => {
    fetchProcessedInvoices()
  }, [])

  const fetchProcessedInvoices = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/get-invoices?status=processed")
      const result = await response.json()

      if (result.success) {
        setProcessedInvoices(result.data)
      } else {
        console.error("Failed to fetch invoices:", result.error)
      }
    } catch (error) {
      console.error("Error fetching invoices:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this processed invoice?")) return

    try {
      const response = await fetch(`/api/delete-invoice?id=${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        setProcessedInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
      } else {
        alert(`Failed to delete invoice: ${result.error}`)
      }
    } catch (error) {
      console.error("Error deleting invoice:", error)
      alert("Failed to delete invoice. Please try again.")
    }
  }

  const startEdit = (invoice: UserInvoice) => {
    setEditingId(invoice.id)
    setEditData({
      supplier_name: invoice.supplier_name || "",
      supplier_vat_number: invoice.supplier_vat_number || "",
      invoice_number: invoice.invoice_number || "",
      invoice_date: invoice.invoice_date || "",
      total_amount: invoice.total_amount,
      vat_amount: invoice.vat_amount,
      net_amount: invoice.net_amount,
      processing_notes: invoice.processing_notes || "",
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const saveEdit = async (id: string) => {
    try {
      const response = await fetch("/api/update-invoice", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          supplier: editData.supplier_name,
          vatNumber: editData.supplier_vat_number,
          invoiceNumber: editData.invoice_number,
          date: editData.invoice_date,
          totalAmount: editData.total_amount,
          vatAmount: editData.vat_amount,
          exclusiveAmount: editData.net_amount,
          notes: editData.processing_notes,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setProcessedInvoices((prev) =>
          prev.map((inv) =>
            inv.id === id
              ? {
                  ...inv,
                  supplier_name: editData.supplier_name ?? inv.supplier_name,
                  supplier_vat_number: editData.supplier_vat_number ?? inv.supplier_vat_number,
                  invoice_number: editData.invoice_number ?? inv.invoice_number,
                  invoice_date: editData.invoice_date ?? inv.invoice_date,
                  total_amount: editData.total_amount ?? inv.total_amount,
                  vat_amount: editData.vat_amount ?? inv.vat_amount,
                  net_amount: editData.net_amount ?? inv.net_amount,
                  processing_notes: editData.processing_notes ?? inv.processing_notes,
                }
              : inv,
          ),
        )
        setEditingId(null)
        setEditData({})
      } else {
        alert("Failed to save changes: " + result.error)
      }
    } catch (error) {
      console.error("Error saving invoice:", error)
      alert("Failed to save changes")
    }
  }

  const updateEditData = (field: string, value: string | number | null) => {
    setEditData((prev) => {
      const updated = { ...prev, [field]: value }

      if (field === "vat_amount" && value !== null && updated.total_amount) {
        const vatAmount = typeof value === "number" ? value : Number.parseFloat(value as string)
        if (!Number.isNaN(vatAmount)) {
          updated.net_amount = updated.total_amount - vatAmount
        }
      }

      if (field === "total_amount" && value !== null && updated.vat_amount !== null && updated.vat_amount !== undefined) {
        const totalAmount = typeof value === "number" ? value : Number.parseFloat(value as string)
        const vatAmount = updated.vat_amount
        if (!Number.isNaN(totalAmount) && typeof vatAmount === "number" && !Number.isNaN(vatAmount)) {
          updated.net_amount = totalAmount - vatAmount
        }
      }

      return updated
    })
  }

  const handleExportReport = () => {
    const totalAmount = processedInvoices.reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0)
    const totalVAT = processedInvoices.reduce((sum, inv) => sum + (Number(inv.vat_amount) || 0), 0)
    const totalExclusive = processedInvoices.reduce((sum, inv) => sum + (Number(inv.net_amount) || 0), 0)

    const headers = [
      "Invoice Number",
      "Date",
      "Supplier",
      "VAT Number",
      "Total Amount",
      "VAT Amount",
      "Exclusive Amount",
      "Description",
      "Processing Notes",
    ]
    const rows = processedInvoices.map((inv) => [
      inv.invoice_number || "",
      inv.invoice_date || "",
      inv.supplier_name || "",
      inv.supplier_vat_number || "",
      inv.total_amount ? Number(inv.total_amount).toFixed(2) : "0.00",
      inv.vat_amount ? Number(inv.vat_amount).toFixed(2) : "Not specified",
      inv.net_amount ? Number(inv.net_amount).toFixed(2) : "Not specified",
      inv.extracted_data?.description || "",
      inv.processing_notes || "",
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      "",
      `Total,,,,"${totalAmount.toFixed(2)}","${totalVAT.toFixed(2)}","${totalExclusive.toFixed(2)}"`,
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vatify-processed-invoices-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const totalAmount = processedInvoices.reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0)
  const totalVAT = processedInvoices.reduce((sum, inv) => sum + (Number(inv.vat_amount) || 0), 0)
  const totalExclusive = processedInvoices.reduce((sum, inv) => sum + (Number(inv.net_amount) || 0), 0)

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Processed Invoices</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading processed invoices...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Processed Invoices</h1>
        {processedInvoices.length > 0 && (
          <Button onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        )}
      </div>

      {processedInvoices.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No processed invoices</CardTitle>
            <CardDescription>Processed invoices will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Once you've processed invoices, you can view them here and generate VAT return summaries that align with
              SARS requirements.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Amount</CardDescription>
                <CardTitle className="text-2xl">R{totalAmount.toFixed(2)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total VAT</CardDescription>
                <CardTitle className="text-2xl">R{totalVAT.toFixed(2)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Exclusive</CardDescription>
                <CardTitle className="text-2xl">R{totalExclusive.toFixed(2)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">All Processed Invoices ({processedInvoices.length})</h2>

            <div className="grid gap-4">
              {processedInvoices.map((invoice) => (
                <Card key={invoice.id} className="border-accent/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{invoice.file_name}</h3>
                          <Badge className="bg-green-100 text-green-800">Processed</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <span className="font-medium">Size:</span>{" "}
                            {invoice.file_size ? (invoice.file_size / 1024 / 1024).toFixed(2) : "0"} MB
                          </div>
                          <div>
                            <span className="font-medium">Uploaded:</span>{" "}
                            {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : "N/A"}
                          </div>
                          {invoice.total_amount !== null && (
                            <>
                              <div>
                                <span className="font-medium">Total:</span> R{Number(invoice.total_amount).toFixed(2)}
                              </div>
                              <div>
                                <span className="font-medium">VAT:</span> R
                                {invoice.vat_amount !== null ? Number(invoice.vat_amount).toFixed(2) : "Not specified"}
                              </div>
                            </>
                          )}
                        </div>

                        {editingId === invoice.id ? (
                          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`supplier-${invoice.id}`}>Supplier</Label>
                                <Input
                                  id={`supplier-${invoice.id}`}
                                  value={editData.supplier_name || ""}
                                  onChange={(e) => updateEditData("supplier_name", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`vatNumber-${invoice.id}`}>VAT Number</Label>
                                <Input
                                  id={`vatNumber-${invoice.id}`}
                                  value={editData.supplier_vat_number || ""}
                                  onChange={(e) => updateEditData("supplier_vat_number", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`invoiceNumber-${invoice.id}`}>Invoice Number</Label>
                                <Input
                                  id={`invoiceNumber-${invoice.id}`}
                                  value={editData.invoice_number || ""}
                                  onChange={(e) => updateEditData("invoice_number", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`date-${invoice.id}`}>Date</Label>
                                <Input
                                  id={`date-${invoice.id}`}
                                  type="date"
                                  value={editData.invoice_date || ""}
                                  onChange={(e) => updateEditData("invoice_date", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`totalAmount-${invoice.id}`}>Total Amount</Label>
                                <Input
                                  id={`totalAmount-${invoice.id}`}
                                  type="number"
                                  step="0.01"
                                  value={editData.total_amount || ""}
                                  onChange={(e) => updateEditData("total_amount", Number.parseFloat(e.target.value))}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`vatAmount-${invoice.id}`}>VAT Amount</Label>
                                <Input
                                  id={`vatAmount-${invoice.id}`}
                                  type="number"
                                  step="0.01"
                                  placeholder="Leave blank if not specified"
                                  value={
                                    editData.vat_amount !== null && editData.vat_amount !== undefined
                                      ? editData.vat_amount
                                      : ""
                                  }
                                  onChange={(e) =>
                                    updateEditData(
                                      "vat_amount",
                                      e.target.value === "" ? null : Number.parseFloat(e.target.value),
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor={`netAmount-${invoice.id}`}>Exclusive Amount</Label>
                                <Input
                                  id={`netAmount-${invoice.id}`}
                                  type="number"
                                  step="0.01"
                                  placeholder="Leave blank if not specified"
                                  value={
                                    editData.net_amount !== null && editData.net_amount !== undefined
                                      ? editData.net_amount
                                      : ""
                                  }
                                  onChange={(e) =>
                                    updateEditData(
                                      "net_amount",
                                      e.target.value === "" ? null : Number.parseFloat(e.target.value),
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor={`notes-${invoice.id}`}>Additional Notes</Label>
                              <textarea
                                id={`notes-${invoice.id}`}
                                className="w-full min-h-[100px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Add any additional details or notes about this invoice..."
                                value={editData.processing_notes || ""}
                                onChange={(e) => updateEditData("processing_notes", e.target.value)}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={cancelEdit}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                              </Button>
                              <Button onClick={() => saveEdit(invoice.id)}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        ) : (
                          invoice.extracted_data && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Building className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium">Supplier</span>
                                  </div>
                                  <p className="text-sm">{invoice.supplier_name || "N/A"}</p>
                                  <p className="text-xs text-gray-500">VAT: {invoice.supplier_vat_number || "N/A"}</p>
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium">Invoice Details</span>
                                  </div>
                                  <p className="text-sm">{invoice.invoice_number || "N/A"}</p>
                                  <p className="text-xs text-gray-500">{invoice.invoice_date || "N/A"}</p>
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2 mb-1">
                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium">Amounts</span>
                                  </div>
                                  <p className="text-sm">
                                    Total: R{invoice.total_amount ? Number(invoice.total_amount).toFixed(2) : "0.00"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    VAT:{" "}
                                    {invoice.vat_amount !== null
                                      ? `R${Number(invoice.vat_amount).toFixed(2)}`
                                      : "Not specified"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Excl:{" "}
                                    {invoice.net_amount !== null
                                      ? `R${Number(invoice.net_amount).toFixed(2)}`
                                      : "Not specified"}
                                  </p>
                                </div>
                              </div>
                              {invoice.processing_notes && (
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                  <p className="text-sm font-medium text-blue-900 mb-1">Additional Notes:</p>
                                  <p className="text-sm text-blue-800 whitespace-pre-wrap">
                                    {invoice.processing_notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>

                      <div className="flex space-x-2 ml-4">
                        {editingId !== invoice.id && (
                          <Button variant="ghost" size="sm" onClick={() => startEdit(invoice)} title="Edit invoice">
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          title="Delete invoice"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
