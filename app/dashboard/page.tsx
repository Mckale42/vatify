"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import type { UserInvoice } from "@/lib/types/database"
import { getCompanyDetails } from "@/app/actions/onboarding"

export default function DashboardPage() {
  const [processedInvoices, setProcessedInvoices] = useState<UserInvoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const companyDetailsResult = await getCompanyDetails()
      if (companyDetailsResult.success && companyDetailsResult.data) {
        setUserName(companyDetailsResult.data.contact_name)
      }

      const invoicesResponse = await fetch("/api/get-invoices?status=processed")

      if (!invoicesResponse.ok) {
        console.error("Invoice fetch failed with status:", invoicesResponse.status)
        setProcessedInvoices([])
        return
      }

      const contentType = invoicesResponse.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON, content-type:", contentType)
        setProcessedInvoices([])
        return
      }

      const invoicesResult = await invoicesResponse.json()

      if (invoicesResult.success && invoicesResult.data) {
        setProcessedInvoices(invoicesResult.data)
      } else {
        console.error("Invoice fetch unsuccessful:", invoicesResult)
        setProcessedInvoices([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load dashboard data. Please try refreshing the page.")
      setProcessedInvoices([])
    } finally {
      setIsLoading(false)
    }
  }

  const totalAmount = processedInvoices.reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0)
  const totalVAT = processedInvoices.reduce((sum, inv) => sum + (Number(inv.vat_amount) || 0), 0)
  const totalExclusive = processedInvoices.reduce((sum, inv) => sum + (Number(inv.net_amount) || 0), 0)

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-primary">Welcome back!</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-primary">Welcome back{userName ? `, ${userName}` : ""}!</h1>

      {error && (
        <Card className="border-red-500 bg-red-50 mb-6">
          <CardContent className="p-4">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-accent/20">
          <CardHeader className="pb-3">
            <CardDescription>Total Amount</CardDescription>
            <CardTitle className="text-2xl">R{totalAmount.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-accent/20">
          <CardHeader className="pb-3">
            <CardDescription>Total VAT</CardDescription>
            <CardTitle className="text-2xl">R{totalVAT.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-accent/20">
          <CardHeader className="pb-3">
            <CardDescription>Total Exclusive</CardDescription>
            <CardTitle className="text-2xl">R{totalExclusive.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-primary">Getting Started</CardTitle>
            <CardDescription>Start capturing your VAT-able expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Navigate to the Invoices page to upload your first invoice</li>
              <li>Take a photo or upload an image of your invoice</li>
              <li>Our AI will automatically extract the VAT information</li>
              <li>Review and confirm the extracted data</li>
              <li>Generate reports for SARS submission</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
