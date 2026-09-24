import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

export default function WhyVatifyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#f8f9fc] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-[#0A2463]">
            Why <span className="text-[#2563EB]">VATIFY?</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Discover why thousands of South African businesses trust VATIFY to maximize their VAT claims
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#0A2463]">The Problem</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            South African businesses are losing thousands of rands in unclaimed VAT refunds
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <AlertTriangle className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle className="text-red-800">Lost Paperwork</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">
                Invoices and receipts get misplaced, making it impossible to claim VAT refunds when filing returns.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <Clock className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle className="text-red-800">Time-Consuming Process</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">
                Manual data entry and organization takes hours, leading many businesses to skip smaller claims.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <AlertTriangle className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle className="text-red-800">Lack of Awareness</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">
                Many small businesses don't realize they can reclaim VAT on everyday expenses like fuel, office
                supplies, and services.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Solution */}
      <section className="bg-[#f8f9fc] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#0A2463]">Our Solution</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              VATIFY transforms the way you handle VAT claims - making it simple, fast, and profitable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-green-800">Snap & Capture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700">
                  Simply photograph your invoices with your phone. Our AI instantly extracts all VAT information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-green-800">Maximize Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700">
                  Never miss a claimable expense again. Our system ensures you capture every eligible VAT amount.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-green-800">SARS Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700">
                  Generate compliant reports instantly or let VATIFY handle e-filing directly with SARS.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#0A2463]">The Impact</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-[#2563EB] mb-2">R50,000+</div>
            <p className="text-gray-600">Average annual VAT recovered per business</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#2563EB] mb-2">95%</div>
            <p className="text-gray-600">Time saved on VAT administration</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#2563EB] mb-2">1000+</div>
            <p className="text-gray-600">Businesses already using VATIFY</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A2463] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Stop Losing Money?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the businesses that have already recovered thousands in VAT claims with VATIFY.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6 bg-[#2563EB] hover:bg-[#2563EB]/90">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-[#0A2463] bg-transparent"
              >
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
