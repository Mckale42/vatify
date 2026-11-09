import type React from "react"
import { redirect } from "next/navigation"
import { getUser } from "@/app/actions/auth"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserMenu } from "@/components/user-menu"
import Image from "next/image"
import Link from "next/link"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-white flex">
        <DashboardNav />
        <SidebarInset className="flex-1 min-w-0 overflow-x-hidden">
          <header className="bg-white border-b border-accent/30">
            <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-6 sm:py-3">
              <div className="flex min-w-0 items-center gap-2 sm:gap-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Link href="/dashboard" className="shrink-0 cursor-pointer">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VATIFY-vI6x288tscjZoB5JsphZ5PSv9Zwrgw.png"
                    alt="Vatify Logo"
                    width={180}
                    height={72}
                    className="h-10 w-auto shrink-0 object-contain sm:h-14"
                  />
                </Link>
              </div>
              <UserMenu user={{ email: user.email || "User" }} />
            </div>
          </header>
          <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
