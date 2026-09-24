"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageCircle, ReceiptText, Settings2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "Invoices", href: "/dashboard/invoices", icon: ReceiptText },
  { title: "VAT", href: "/dashboard/processed", icon: Sparkles },
  { title: "Chat", href: "/dashboard/vat-chat", icon: MessageCircle },
  { title: "More", href: "/dashboard/company-details", icon: Settings2 },
]

export function MobileNav() {
  const pathname = usePathname()
  return <nav className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md items-center justify-around rounded-[22px] border border-slate-200/80 bg-white/90 p-1.5 shadow-[0_18px_55px_rgba(15,23,42,.18)] backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
    {items.map(({ title, href, icon: Icon }) => {
      const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
      return <Link key={href} href={href} className={cn("relative flex min-w-14 flex-1 flex-col items-center gap-1 rounded-[17px] px-2 py-2 text-[10px] font-semibold transition", active ? "bg-[#0a2463] text-white shadow-md" : "text-slate-500 hover:bg-slate-50 hover:text-[#0a2463]")}>{active && <span className="absolute -top-1 h-1 w-5 rounded-full bg-[#8FB8DE]" />}<Icon className="h-4 w-4" /><span>{title}</span></Link>
    })}
  </nav>
}
