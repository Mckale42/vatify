import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Target, Heart, Award } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#f8f9fc] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-[#0A2463]">
            About <span className="text-[#2563EB]">VATIFY</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            We're on a mission to help South African businesses recover every rand they're entitled to
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-[#0A2463]">Our Mission</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            VATIFY was born from a simple observation: too many South African businesses were leaving money on the
            table. Small businesses, freelancers, and even larger companies were missing out on legitimate VAT claims
            simply because the process was too complex, time-consuming, or they didn't know what they could claim.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            We believe that every business, regardless of size, should have access to the same powerful tools that large
            corporations use to maximize their VAT claims. That's why we built VATIFY - to democratize VAT claim
            processing and help businesses focus on what they do best.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-[#f8f9fc] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#0A2463]">Our Values</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-[#2563EB]/20">
              <CardHeader>
                <Target className="h-12 w-12 text-[#2563EB] mx-auto mb-4" />
                <CardTitle className="text-[#0A2463]">Simplicity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We believe complex problems deserve simple solutions. VAT claims shouldn't require a degree in
                  accounting.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-[#2563EB]/20">
              <CardHeader>
                <Heart className="h-12 w-12 text-[#2563EB] mx-auto mb-4" />
                <CardTitle className="text-[#0A2463]">Empowerment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Every business deserves to maximize their potential. We're here to help you recover what's rightfully
                  yours.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-[#2563EB]/20">
              <CardHeader>
                <Award className="h-12 w-12 text-[#2563EB] mx-auto mb-4" />
                <CardTitle className="text-[#0A2463]">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We're committed to delivering the highest quality service and continuously improving our platform.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-[#2563EB]/20">
              <CardHeader>
                <Users className="h-12 w-12 text-[#2563EB] mx-auto mb-4" />
                <CardTitle className="text-[#0A2463]">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We're proud to support the South African business community and contribute to economic growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#0A2463]">Our Story</h2>

          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#0A2463]">The Problem</h3>
                <p className="text-gray-600">
                  Our founders, experienced entrepreneurs themselves, noticed that small businesses were consistently
                  missing out on VAT claims. Stacks of invoices would pile up, paperwork would get lost, and the manual
                  process was simply too overwhelming for busy business owners.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#0A2463]">The Solution</h3>
                <p className="text-gray-600">
                  We realized that artificial intelligence could solve this problem. By combining advanced OCR
                  technology with machine learning, we could automate the entire VAT claim process - from invoice
                  capture to SARS submission.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#0A2463]">The Impact</h3>
                <p className="text-gray-600">
                  Today, VATIFY helps thousands of South African businesses recover millions of rands in VAT claims
                  every month. We're proud to be part of their success stories and to contribute to the growth of the
                  South African economy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-[#f8f9fc] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#0A2463]">Why We Built VATIFY</h2>

          <div className="max-w-4xl mx-auto">
            <Card className="border-[#2563EB]/20">
              <CardContent className="p-8">
                <blockquote className="text-xl text-gray-600 italic text-center mb-6">
                  "We saw too many businesses struggling with VAT claims - either missing out entirely or spending
                  countless hours on manual processes. We knew technology could solve this problem and help businesses
                  focus on what they do best: growing their companies."
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold text-[#0A2463]">The VATIFY Team</p>
                  <p className="text-gray-600">Founders & Developers</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#0A2463]">Our Impact</h2>

        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-[#2563EB] mb-2">1000+</div>
            <p className="text-gray-600">Businesses Served</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#2563EB] mb-2">R50M+</div>
            <p className="text-gray-600">VAT Recovered</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#2563EB] mb-2">100K+</div>
            <p className="text-gray-600">Invoices Processed</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#2563EB] mb-2">99.5%</div>
            <p className="text-gray-600">Accuracy Rate</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A2463] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Be part of the movement to help South African businesses maximize their VAT claims and grow their success.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6 bg-[#2563EB] hover:bg-[#2563EB]/90">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-[#0A2463] bg-transparent"
              >
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
