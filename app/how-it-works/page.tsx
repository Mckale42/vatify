import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Brain, Download, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#f8f9fc] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-[#0A2463]">
            How <span className="text-[#2563EB]">VATIFY</span> Works
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Three simple steps to maximize your VAT claims and save thousands
          </p>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Step 1 */}
            <div className="text-center">
              <Card className="border-[#2563EB]/20 bg-[#2563EB]/5">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[#0A2463]">1. Snap Your Invoices</h3>
                  <p className="text-gray-600 mb-4">
                    Use your phone camera to photograph invoices, receipts, or slips. Upload multiple documents at once.
                  </p>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-sm text-gray-500 mb-2">Supported formats:</div>
                    <div className="text-sm font-medium">JPG, PNG, PDF, HEIC</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex justify-center">
              <ArrowRight className="h-8 w-8 text-[#2563EB]" />
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <Card className="border-[#2563EB]/20 bg-[#2563EB]/5">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[#0A2463]">2. AI Extracts VAT Data</h3>
                  <p className="text-gray-600 mb-4">
                    Our advanced AI automatically reads and extracts supplier details, VAT amounts, dates, and totals.
                  </p>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-sm text-gray-500 mb-2">Extracted data:</div>
                    <div className="text-sm font-medium">Supplier, VAT #, Amount, Date</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex justify-center">
              <ArrowRight className="h-8 w-8 text-[#2563EB]" />
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <Card className="border-[#2563EB]/20 bg-[#2563EB]/5">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[#0A2463]">3. Download or E-Submit</h3>
                  <p className="text-gray-600 mb-4">
                    Generate SARS-compliant reports instantly or let VATIFY handle e-filing directly with SARS.
                  </p>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-sm text-gray-500 mb-2">Output options:</div>
                    <div className="text-sm font-medium">PDF Report, Excel, E-Filing</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Process */}
      <section className="bg-[#f8f9fc] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#0A2463]">The Complete Process</h2>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-start space-x-6">
              <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#0A2463]">Upload Your Documents</h3>
                <p className="text-gray-600">
                  Take photos of invoices, receipts, or upload existing digital documents. Our system accepts various
                  formats and can process multiple documents simultaneously.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#0A2463]">AI Processing & Validation</h3>
                <p className="text-gray-600">
                  Our AI engine reads the documents, extracts VAT information, validates supplier details against SARS
                  databases, and flags any potential issues for review.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#0A2463]">Review & Approve</h3>
                <p className="text-gray-600">
                  Review the extracted data in an easy-to-use interface. Make any necessary corrections and approve the
                  entries for inclusion in your VAT return.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#0A2463]">Generate Reports & Submit</h3>
                <p className="text-gray-600">
                  Generate SARS-compliant VAT201 returns, detailed reports, and supporting documentation. Choose to
                  download for manual submission or use our e-filing service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A2463] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to See It in Action?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start your free trial to experience how easy VAT claims can be.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6 bg-[#2563EB] hover:bg-[#2563EB]/90">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/features">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-[#0A2463] bg-transparent"
              >
                View Features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
