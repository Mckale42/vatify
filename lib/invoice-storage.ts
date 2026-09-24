export interface ExtractedData {
  supplier: string
  vatNumber: string
  invoiceNumber: string
  date: string
  totalAmount: number
  vatAmount: number
  exclusiveAmount: number
  description: string
}

export interface Invoice {
  id: string
  fileName: string
  fileSize: number
  uploadedAt: string
  status: "uploading" | "processing" | "processed" | "error"
  extractedData?: ExtractedData
  imageUrl?: string
  error?: string
  errorDetails?: string
}

const STORAGE_KEY = "vatify_invoices"

export const invoiceStorage = {
  // Get all invoices from localStorage
  getAll(): Invoice[] {
    if (typeof window === "undefined") return []
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error reading invoices from storage:", error)
      return []
    }
  },

  // Get only processed invoices
  getProcessed(): Invoice[] {
    return this.getAll().filter((invoice) => invoice.status === "processed")
  },

  // Save a new invoice
  save(invoice: Invoice): void {
    if (typeof window === "undefined") return
    try {
      const invoices = this.getAll()
      const existingIndex = invoices.findIndex((inv) => inv.id === invoice.id)

      if (existingIndex >= 0) {
        // Update existing invoice
        invoices[existingIndex] = invoice
      } else {
        // Add new invoice
        invoices.unshift(invoice)
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
    } catch (error) {
      console.error("Error saving invoice to storage:", error)
    }
  },

  // Update an existing invoice
  update(id: string, updates: Partial<Invoice>): void {
    if (typeof window === "undefined") return
    try {
      const invoices = this.getAll()
      const index = invoices.findIndex((inv) => inv.id === id)

      if (index >= 0) {
        invoices[index] = { ...invoices[index], ...updates }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
      }
    } catch (error) {
      console.error("Error updating invoice in storage:", error)
    }
  },

  // Delete an invoice
  delete(id: string): void {
    if (typeof window === "undefined") return
    try {
      const invoices = this.getAll().filter((inv) => inv.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
    } catch (error) {
      console.error("Error deleting invoice from storage:", error)
    }
  },

  // Clear all invoices
  clear(): void {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error("Error clearing invoices from storage:", error)
    }
  },
}
