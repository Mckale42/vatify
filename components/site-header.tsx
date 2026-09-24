"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { MobileNav } from "@/components/mobile-nav"

const navigationItems = [
  { title: "Home", href: "/" },
  { title: "Why VATIFY?", href: "/why-vatify" },
  { title: "How It Works", href: "/how-it-works" },
  { title: "Features", href: "/features" },
  { title: "Pricing", href: "/pricing" },
  { title: "FAQ", href: "/faq" },
  { title: "About Us", href: "/about" },
  { title: "Contact", href: "/contact" },
]

export function SiteHeader() {
  const pathname = usePathname()

  // Don't show site header on dashboard pages or signup page
  if (pathname.startsWith("/dashboard") || pathname === "/login" || pathname === "/signup") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <MobileNav />
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VATIFY-vI6x288tscjZoB5JsphZ5PSv9Zwrgw.png"
                alt="Vatify Logo"
                width={120}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="flex space-x-1">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        pathname === item.href && "bg-accent text-accent-foreground",
                      )}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
