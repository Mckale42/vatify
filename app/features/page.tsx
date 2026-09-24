import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Brain, Shield, FileText, BarChart3, Cloud, Smartphone, Zap, CheckCircle, Globe } from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#f8f9fc] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-[#0A2463]">
            Powerful <span className="text-[#2563EB]">Features</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Everything you need to maximize your VAT claims and streamline compliance
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#0A2463]">Core Features</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-[#2563EB]/20">
            <CardHeader>
              <Camera className="h-12 w-12 text-[#2563EB] mb-4" />
              <CardTitle className="text-[#0A2463]">Invoice Capture & AI-OCR</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Advanced AI-powered optical character recognition that accurately extracts data from any invoice format.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Multiple file formats supported
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Batch processing capability
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  99.5% accuracy rate
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-[#2563EB]/20">
            <CardHeader>
              <Shield className="h-12 w-12 text-[#2563EB] mb-4" />
              <CardTitle className="text-[#0A2463]">Secure Cloud Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Bank-grade security with encrypted storage for all your invoices and financial data.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  256-bit encryption
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  POPIA compliant
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Automatic backups
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-[#2563EB]/20">
            <CardHeader>
              <FileText className="h-12 w-12 text-[#2563EB] mb-4" />
              <CardTitle className="text-[#0A2463]">Automated Report Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Generate SARS-compliant VAT201 returns and detailed reports with a single click.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  VAT201 forms
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Detailed breakdowns
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Export to Excel/PDF
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-[#2563EB]/20">
            <CardHeader>
              <Globe className="h-12 w-12 text-[#2563EB] mb-4" />
              <CardTitle className="text-[#0A2463]">SARS E-Filing Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Direct integration with SARS eFiling for seamless submission of your VAT returns.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Direct submission
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Real-time status updates
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Automatic confirmations
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-[#2563EB]/20">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-[#2563EB] mb-4" />
              <CardTitle className="text-[#0A2463]">Analytics & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gain valuable insights into your VAT claims and identify opportunities for savings.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Spending analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Trend tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Savings opportunities
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-[#2563EB]/20">
            <CardHeader>
              <Smartphone className="h-12 w-12 text-[#2563EB] mb-4" />
              <CardTitle className="text-[#0A2463]">Mobile App</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Capture invoices on the go with our mobile app for iOS and Android.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Offline capture
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Auto-sync
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Push notifications
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="bg-[#f8f9fc] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#0A2463]">Advanced Features</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-[#2563EB]/20">
              <CardHeader>
                <Brain className="h-12 w-12 text-[#2563EB] mb-4" />
                <CardTitle className="text-[#0A2463]">Smart Validation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  AI-powered validation checks ensure accuracy and compliance with SARS requirements.
                </p>
                <div className="space-y-3">
                  <Badge variant="outline">Supplier verification</Badge>
                  <Badge variant="outline">VAT number validation</Badge>
                  <Badge variant="outline">Duplicate detection</Badge>
                  <Badge variant="outline">Amount verification</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2563EB]/20">
              <CardHeader>
                <Zap className="h-12 w-12 text-[#2563EB] mb-4" />
                <CardTitle className="text-[#0A2463]">Automation Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Set up custom rules to automatically categorize and process invoices based on your business needs.
                </p>
                <div className="space-y-3">
                  <Badge variant="outline">Auto-categorization</Badge>
                  <Badge variant="outline">Approval workflows</Badge>
                  <Badge variant="outline">Custom triggers</Badge>
                  <Badge variant="outline">Notification rules</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2563EB]/20">
              <CardHeader>
                <Cloud className="h-12 w-12 text-[#2563EB] mb-4" />
                <CardTitle className="text-[#0A2463]">API Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Connect VATIFY with your existing accounting software and business systems.
                </p>
                <div className="space-y-3">
                  <Badge variant="outline">Xero integration</Badge>
                  <Badge variant="outline">QuickBooks sync</Badge>
                  <Badge variant="outline">Sage compatibility</Badge>
                  <Badge variant="outline">Custom API access</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2563EB]/20">
              <CardHeader>
                <FileText className="h-12 w-12 text-[#2563EB] mb-4" />
                <CardTitle className="text-[#0A2463]">Multi-Format Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Process invoices in any format, from any source, with our advanced document processing engine.
                </p>
                <div className="space-y-3">
                  <Badge variant="outline">PDF documents</Badge>
                  <Badge variant="outline">Image files</Badge>
                  <Badge variant="outline">Email attachments</Badge>
                  <Badge variant="outline">Scanned documents</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#0A2463]">Why Choose VATIFY?</h2>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-red-600">Traditional Method</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Manual data entry
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Lost paperwork
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Time-consuming process
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Prone to errors
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Missed claims
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 text-[#2563EB]">With VATIFY</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Automated data extraction
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Secure cloud storage
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Process in seconds
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  99.5% accuracy
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Maximize every claim
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A2463] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience These Features?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start your free trial today and see how VATIFY can transform your VAT claim process.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6 bg-[#2563EB] hover:bg-[#2563EB]/90">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-[#0A2463] bg-transparent"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
