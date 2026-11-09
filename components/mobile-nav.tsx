"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

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

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VATIFY-vI6x288tscjZoB5JsphZ5PSv9Zwrgw.png"
              alt="Vatify Logo"
              width={120}
              height={48}
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                  pathname === item.href ? "text-foreground" : "text-foreground/60",
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90">Login</Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
