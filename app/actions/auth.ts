"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function logout() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function getUser() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function assignDefaultRole(userId: string) {
  const supabase = await createServerClient()

  // Check if user already has a role
  const { data: existingRole } = await supabase.from("user_roles").select("*").eq("user_id", userId).maybeSingle()

  // If no role exists, assign default "user" role
  if (!existingRole) {
    const { error } = await supabase.from("user_roles").insert({
      user_id: userId,
      role: "user",
    })

    if (error) {
      console.error("[v0] Error assigning default role:", error)
      return { success: false, error: error.message }
    }
  }

  return { success: true }
}
