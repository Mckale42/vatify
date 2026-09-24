import type React from "react"
import { redirect } from "next/navigation"
import { getUser } from "@/app/actions/auth"
import { DashboardNav } from "@/components/dashboard-nav"
import { MobileNav } from "@/components/mobile-nav"
import { UserMenu } from "@/components/user-menu"
import Image from "next/image"
import Link from "next/link"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Bell } from "lucide-react"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect("/login")

  return <SidebarProvider>
    <div className="min-h-screen bg-[#f7f9fc]">
      <DashboardNav />
      <SidebarInset className="bg-[#f7f9fc]">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
          <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-10 w-10 rounded-xl hover:bg-blue-50 hover:text-[#0a2463]" />
              <Separator orientation="vertical" className="hidden h-6 sm:block" />
              <Link href="/dashboard" className="group flex items-center">
                <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VATIFY-vI6x288tscjZoB5JsphZ5PSv9Zwrgw.png" alt="VATIFY" width={140} height={56} className="h-10 w-auto object-contain transition group-hover:scale-[1.02]" priority />
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button aria-label="Notifications" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0a2463] sm:hidden"><Bell className="h-4 w-4" /></button>
              <UserMenu user={{ email: user.email || "User" }} />
            </div>
          </div>
        </header>
        <main className="min-h-[calc(100vh-72px)] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">{process.env.VATIFY_DEMO_MODE === "true" && <div className="mb-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-medium text-[#0a2463]">Demo mode · UI and invoice flow are using sample data. Add your Supabase/Gemini environment variables to test the live backend.</div>}{children}</main>
        <MobileNav />
      </SidebarInset>
    </div>
  </SidebarProvider>
}
