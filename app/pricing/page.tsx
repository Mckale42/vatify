import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#f8f9fc] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-[#0A2463]">
            Simple, Transparent <span className="text-[#2563EB]">Pricing</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Choose the plan that fits your business needs. Start free, upgrade when you're ready.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#0A2463]">Free</CardTitle>
              <div className="text-4xl font-bold text-[#2563EB] mt-4">R0</div>
              <p className="text-gray-600">per month</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Up to 10 invoices per month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Basic AI extraction</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>PDF report generation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Email support</span>
                </li>
                <li className="flex items-center">
                  <X className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-400">SARS e-filing</span>
                </li>
                <li className="flex items-center">
                  <X className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-400">Advanced analytics</span>
                </li>
              </ul>
              <Link href="/login">
                <Button className="w-full" variant="outline">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card className="border-[#2563EB] relative">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#2563EB]">Most Popular</Badge>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#0A2463]">Professional</CardTitle>
              <div className="text-4xl font-bold text-[#2563EB] mt-4">R299</div>
              <p className="text-gray-600">per month</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Up to 100 invoices per month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Advanced AI extraction</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>SARS e-filing integration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Mobile app access</span>
                </li>
              </ul>
              <Link href="/login">
                <Button className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90">Start 14-Day Trial</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#0A2463]">Enterprise</CardTitle>
              <div className="text-4xl font-bold text-[#2563EB] mt-4">R999</div>
              <p className="text-gray-600">per month</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Unlimited invoices</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Custom AI training</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>API access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Multi-user accounts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Custom integrations</span>
                </li>
              </ul>
              <Link href="/contact">
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#f8f9fc] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#0A2463]">Pricing FAQ</h2>

          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#0A2463]">What's included in the free trial?</h3>
              <p className="text-gray-600">
                The 14-day free trial includes full access to all Professional plan features, including SARS e-filing,
                advanced analytics, and priority support. No credit card required.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#0A2463]">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll
                prorate any billing adjustments.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#0A2463]">What happens if I exceed my invoice limit?</h3>
              <p className="text-gray-600">
                If you exceed your monthly invoice limit, you'll be prompted to upgrade your plan. We'll never stop your
                service without notice.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#0A2463]">Is there a setup fee?</h3>
              <p className="text-gray-600">
                No setup fees for any plan. You only pay the monthly subscription fee, and you can cancel anytime with
                no penalties.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#0A2463]">Do you offer annual discounts?</h3>
              <p className="text-gray-600">
                Yes! Save 20% when you pay annually. Contact our sales team for custom enterprise pricing and volume
                discounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A2463] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using VATIFY to maximize their VAT claims.
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
