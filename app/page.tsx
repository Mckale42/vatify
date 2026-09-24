import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, FileText, BarChart3, Coins } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#f8f9fc] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Simplify your VAT Claims <br />
            with <span className="text-[#2563EB]">VATIFY!</span>
          </h1>
          <p className="text-xl text-gray-700 mb-2 max-w-3xl mx-auto">
            Effortlessly manage and process your VAT claims.
          </p>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Upload invoices, track processed claims, and gain valuable insights.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6 bg-[#2563EB] hover:bg-[#2563EB]/90">
                Get Started
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-accent/20 text-center">
            <CardContent className="p-6">
              <Camera className="h-12 w-12 text-[#2563EB] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Snap & Extract</h3>
              <p className="text-gray-600">AI-powered invoice scanning</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 text-center">
            <CardContent className="p-6">
              <FileText className="h-12 w-12 text-[#2563EB] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
              <p className="text-gray-600">Centralized record keeping</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 text-center">
            <CardContent className="p-6">
              <BarChart3 className="h-12 w-12 text-[#2563EB] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Instant Reports</h3>
              <p className="text-gray-600">SARS-ready submissions</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 text-center">
            <CardContent className="p-6">
              <Coins className="h-12 w-12 text-[#2563EB] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Maximize Claims</h3>
              <p className="text-gray-600">Recover every rand</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0A2463] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of South African businesses already using VATIFY to maximize their VAT claims.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-6 bg-[#2563EB] hover:bg-[#2563EB]/90">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
