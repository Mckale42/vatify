import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  const faqs = [
    {
      question: "Can I really reclaim VAT on my business expenses?",
      answer:
        "Yes! If you're VAT registered, you can reclaim VAT on most business expenses including fuel, office supplies, equipment, professional services, and more. Many businesses don't realize how much they can claim back.",
    },
    {
      question: "What file formats does VATIFY support?",
      answer:
        "VATIFY supports JPG, PNG, PDF, HEIC, and most common image formats. You can upload photos taken with your phone, scanned documents, or digital invoices received via email.",
    },
    {
      question: "How secure is my financial data?",
      answer:
        "We use bank-grade 256-bit encryption and are fully POPIA compliant. Your data is stored securely in South African data centers with automatic backups and 24/7 monitoring.",
    },
    {
      question: "How accurate is the AI extraction?",
      answer:
        "Our AI has a 99.5% accuracy rate for extracting VAT information from invoices. You can always review and edit any extracted data before submitting your returns.",
    },
    {
      question: "Can VATIFY integrate with my accounting software?",
      answer:
        "Yes! We integrate with popular accounting software including Xero, QuickBooks, and Sage. Enterprise plans also include custom API access for bespoke integrations.",
    },
    {
      question: "What support do you offer?",
      answer:
        "Free users get email support, Professional users get priority support, and Enterprise users get dedicated account management. We also have comprehensive help documentation and video tutorials.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "There are no long-term contracts or cancellation fees. You can cancel your subscription at any time from your account settings.",
    },
    {
      question: "Do you offer training for my team?",
      answer:
        "Yes! Enterprise customers receive onboarding training and ongoing support. We also offer webinars and training sessions for Professional plan users.",
    },
    {
      question: "What happens to my data if I cancel?",
      answer:
        "You can export all your data before canceling. We retain your data for 30 days after cancellation in case you want to reactivate, then it's permanently deleted.",
    },
    {
      question: "Can VATIFY handle different VAT rates?",
      answer:
        "Yes! VATIFY automatically recognizes standard VAT (15%), zero-rated items, and exempt supplies. It also handles special VAT scenarios and can be configured for your specific business needs.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#f8f9fc] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-[#0A2463]">
            Frequently Asked <span className="text-[#2563EB]">Questions</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Find answers to common questions about VATIFY and VAT claims
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-[#2563EB]/20">
                <CardHeader>
                  <CardTitle className="flex items-start text-[#0A2463]">
                    <HelpCircle className="h-6 w-6 text-[#2563EB] mr-3 mt-1 flex-shrink-0" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 ml-9">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="bg-[#f8f9fc] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#0A2463]">Still Have Questions?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you get the most out of VATIFY
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                Contact Support
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
