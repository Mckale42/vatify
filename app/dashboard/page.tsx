"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, Bell, Camera, CheckCircle2, ChevronRight, FileText, Plus, Receipt, Sparkles, TrendingUp, WalletCards, Upload, MessageCircle } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getCompanyDetails } from "@/app/actions/onboarding"
import type { UserInvoice } from "@/lib/types/database"

const activity = [
  { name: "Mon", value: 8200 },
  { name: "Tue", value: 11200 },
  { name: "Wed", value: 9800 },
  { name: "Thu", value: 14600 },
  { name: "Fri", value: 12800 },
  { name: "Sat", value: 8900 },
  { name: "Sun", value: 10400 },
]

const currency = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 2 })

export default function DashboardPage() {
  const [processedInvoices, setProcessedInvoices] = useState<UserInvoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState("")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [quickActionsOpen, setQuickActionsOpen] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [company, response] = await Promise.all([
          getCompanyDetails(),
          fetch("/api/get-invoices?status=processed", { cache: "no-store" }),
        ])
        if (!active) return
        if (company.success && company.data) setUserName(company.data.contact_name?.split(" ")[0] || "there")
        if (!response.ok) throw new Error("Unable to load invoices")
        const result = await response.json()
        setProcessedInvoices(result.success && result.data ? result.data : [])
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        if (active) setIsLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const totals = useMemo(() => processedInvoices.reduce(
    (acc, invoice) => ({
      total: acc.total + (Number(invoice.total_amount) || 0),
      vat: acc.vat + (Number(invoice.vat_amount) || 0),
      net: acc.net + (Number(invoice.net_amount) || 0),
    }),
    { total: 0, vat: 0, net: 0 },
  ), [processedInvoices])

  const recent = processedInvoices.slice(0, 4)

  if (isLoading) {
    return <div className="space-y-5"><div className="h-40 rounded-[30px] bg-slate-200/70 animate-pulse" /><div className="grid gap-4 sm:grid-cols-3"><div className="h-32 rounded-[24px] bg-slate-200/70 animate-pulse" /><div className="h-32 rounded-[24px] bg-slate-200/70 animate-pulse [animation-delay:120ms]" /><div className="h-32 rounded-[24px] bg-slate-200/70 animate-pulse [animation-delay:240ms]" /></div><div className="h-80 rounded-[30px] bg-slate-200/70 animate-pulse" /></div>
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-24 lg:pb-8">
      <section className="vatify-hero relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#061945] via-[#0a2463] to-[#2563a9] px-5 py-6 text-white shadow-[0_24px_70px_rgba(10,36,99,.22)] sm:px-7 sm:py-8">
        <div className="vatify-orb absolute -right-20 -top-28 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="vatify-orb vatify-orb-delay absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-[#8fb8de]/20 blur-3xl" />
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,.55)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" /> VATify is up to date
            </div>
            <p className="text-sm text-blue-100">Good morning{userName ? `, ${userName}` : ""}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Your VAT, at a glance.</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">Capture invoices, keep your records organised and understand your VAT position without the spreadsheet headache.</p>
          </div>
          <button onClick={() => setNotificationsOpen(true)} aria-label="Open notifications" className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur transition duration-300 hover:scale-105 hover:bg-white/15 sm:flex">
            <Bell className="h-5 w-5" />
            <span className="absolute mt-[-28px] ml-6 h-2 w-2 rounded-full bg-rose-400 ring-2 ring-[#0a2463]" />
          </button>
        </div>
        <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-12 rounded-2xl bg-white px-5 text-[#0a2463] shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-xl">
            <Link href="/dashboard/invoices"><Camera className="mr-2 h-4 w-4" /> Capture invoice</Link>
          </Button>
          <Button asChild variant="ghost" className="h-12 rounded-2xl border border-white/15 bg-white/10 px-5 text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/15 hover:text-white">
            <Link href="/dashboard/processed">View processed <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {error && <div className="vatify-shake rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard icon={WalletCards} label="Total captured" value={totals.total} helper={`${processedInvoices.length} processed invoices`} />
        <MetricCard icon={TrendingUp} label="VAT captured" value={totals.vat} helper="Across your processed records" />
        <MetricCard icon={Receipt} label="Excluding VAT" value={totals.net} helper="Net invoice value" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.55fr_.85fr]">
        <Card className="vatify-card overflow-hidden rounded-[28px] border-0 shadow-[0_12px_45px_rgba(15,23,42,.07)]">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div><p className="text-sm font-medium text-muted-foreground">Invoice activity</p><h2 className="mt-1 text-xl font-semibold tracking-tight">This week</h2></div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0a2463]"><span className="h-1.5 w-1.5 rounded-full bg-[#3E92CC] animate-ping" /><span className="absolute h-1.5 w-1.5 rounded-full bg-[#3E92CC]" />Live view</span>
            </div>
            <div className="mt-5 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activity} margin={{ top: 10, right: 4, left: -24, bottom: 0 }}>
                  <defs><linearGradient id="vatifyActivity" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3E92CC" stopOpacity={0.32}/><stop offset="100%" stopColor="#3E92CC" stopOpacity={0.02}/></linearGradient></defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip cursor={{ stroke: "#8FB8DE", strokeDasharray: "4 4" }} formatter={(value: number) => currency.format(value)} contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 12px 30px rgba(15,23,42,.1)" }} />
                  <Area type="monotone" dataKey="value" stroke="#0A2463" strokeWidth={3} fill="url(#vatifyActivity)" animationDuration={1200} animationEasing="ease-out" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="vatify-card rounded-[28px] border-0 bg-[#f4f8fc] shadow-none">
          <CardContent className="flex h-full flex-col p-5 sm:p-6">
            <div className="vatify-float flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0a2463] text-white shadow-lg"><Sparkles className="h-5 w-5" /></div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[.18em] text-[#3E92CC]">Smart assistant</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Keep your VAT records tidy.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Use VAT Chat to ask about claims, documents or the numbers you see in your workspace.</p>
            <Button asChild variant="outline" className="mt-auto h-11 rounded-2xl border-slate-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><Link href="/dashboard/vat-chat">Open VAT Chat <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></Button>
          </CardContent>
        </Card>
      </section>

      <section className="vatify-card rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_45px_rgba(15,23,42,.05)] sm:p-6">
        <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-medium text-muted-foreground">Recent activity</p><h2 className="mt-1 text-xl font-semibold tracking-tight">Latest invoices</h2></div><Link href="/dashboard/processed" className="text-sm font-semibold text-[#0a2463] transition hover:translate-x-0.5 hover:underline">See all</Link></div>
        <div className="mt-4 divide-y divide-slate-100">
          {recent.length ? recent.map((invoice, index) => <div key={invoice.id} className="vatify-list-row flex items-center gap-3 py-4" style={{ animationDelay: `${index * 70}ms` }}><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0a2463] transition duration-300 group-hover:scale-105"><FileText className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{invoice.supplier_name || invoice.file_name}</p><p className="mt-0.5 text-xs text-slate-500">{invoice.invoice_number || "Invoice"} · {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString("en-ZA") : "Date not set"}</p></div><div className="text-right"><p className="text-sm font-semibold text-slate-900">{currency.format(Number(invoice.total_amount) || 0)}</p><p className="mt-0.5 inline-flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 className="h-3 w-3" />Processed</p></div></div>) : <div className="py-10 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-medium">No processed invoices yet</p><p className="mt-1 text-xs text-muted-foreground">Capture your first invoice to start building your VAT record.</p></div>}
        </div>
      </section>

      <button onClick={() => setQuickActionsOpen(true)} className="vatify-fab fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#0a2463] text-white shadow-[0_12px_35px_rgba(10,36,99,.35)] transition duration-300 hover:scale-110 hover:bg-[#12327d] lg:hidden" aria-label="Open quick actions"><Plus className="h-6 w-6 transition-transform duration-300" /></button>

      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="max-w-md rounded-[28px] border-slate-200 p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-[#061945] to-[#0a2463] px-6 py-5 text-white">
            <DialogHeader><DialogTitle className="text-white">Notifications</DialogTitle><DialogDescription className="text-blue-100">A quick look at what needs your attention.</DialogDescription></DialogHeader>
          </div>
          <div className="space-y-2 p-4">
            <NotificationRow title="VAT records are up to date" detail="Your latest processed invoices are available." icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />} />
            <NotificationRow title="Keep an eye on your VAT total" detail="You have new invoice activity this week." icon={<TrendingUp className="h-4 w-4 text-[#0a2463]" />} />
            <NotificationRow title="Need help?" detail="VAT Chat can explain the numbers in your workspace." icon={<MessageCircle className="h-4 w-4 text-[#3E92CC]" />} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={quickActionsOpen} onOpenChange={setQuickActionsOpen}>
        <DialogContent className="max-w-sm rounded-[28px] border-slate-200 p-5">
          <DialogHeader><DialogTitle>Quick action</DialogTitle><DialogDescription>What would you like to do?</DialogDescription></DialogHeader>
          <div className="grid gap-3 pt-2">
            <QuickAction href="/dashboard/invoices" icon={Camera} title="Capture invoice" detail="Use your camera or upload a document" />
            <QuickAction href="/dashboard/processed" icon={FileText} title="View invoices" detail="Review your processed records" />
            <QuickAction href="/dashboard/vat-chat" icon={MessageCircle} title="Ask VAT Chat" detail="Get help with your VAT records" />
            <QuickAction href="/dashboard/documents" icon={Upload} title="Open documents" detail="Manage your uploaded files" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, helper }: { icon: typeof WalletCards; label: string; value: number; helper: string }) {
  return <Card className="vatify-card group rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,.09)]"><CardContent className="p-5"><div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#0a2463] transition duration-300 group-hover:rotate-3 group-hover:scale-110"><Icon className="h-5 w-5" /></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">Tracked</span></div><p className="mt-5 text-xs font-medium text-muted-foreground">{label}</p><AnimatedCurrency value={value} /><p className="mt-1 text-xs text-slate-500">{helper}</p></CardContent></Card>
}

function AnimatedCurrency({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const duration = 850
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])
  return <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 tabular-nums">{currency.format(display)}</p>
}

function NotificationRow({ title, detail, icon }: { title: string; detail: string; icon: React.ReactNode }) {
  return <div className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">{icon}</div><div><p className="text-sm font-semibold text-slate-900">{title}</p><p className="mt-0.5 text-xs leading-5 text-slate-500">{detail}</p></div></div>
}

function QuickAction({ href, icon: Icon, title, detail }: { href: string; icon: typeof Camera; title: string; detail: string }) {
  return <Link href={href} className="group flex items-center gap-3 rounded-2xl border border-slate-200 p-3 transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0a2463] transition group-hover:scale-105"><Icon className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900">{title}</p><p className="text-xs text-slate-500">{detail}</p></div><ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#0a2463]" /></Link>
}
