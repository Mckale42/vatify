"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Receipt, FileCheck, MessageSquare, LogOut, FileUp, Building2 } from "lucide-react"
import { logout } from "@/app/actions/auth"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function DashboardNav() {
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Invoices",
      href: "/dashboard/invoices",
      icon: Receipt,
    },
    {
      title: "Processed",
      href: "/dashboard/processed",
      icon: FileCheck,
    },
    {
      title: "VAT Chat",
      href: "/dashboard/vat-chat",
      icon: MessageSquare,
    },
    {
      title: "Company Details",
      href: "/dashboard/company-details",
      icon: Building2,
    },
    {
      title: "Documents",
      href: "/dashboard/documents",
      icon: FileUp,
    },
  ]

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
    } catch (error) {
      console.error("Unexpected error during logout:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-accent/30 bg-white [&[data-mobile=true]]:bg-white">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                      <Link href={item.href}>
                        <Icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              disabled={isLoggingOut}
              tooltip={isLoggingOut ? "Logging out..." : "Logout"}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
