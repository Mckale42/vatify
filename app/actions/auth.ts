"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { User } from "@supabase/supabase-js"

export interface UserWithRole extends User {
  role?: string
}

export async function logout() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function getUserRole(userId: string): Promise<string> {
  if (process.env.VATIFY_DEMO_MODE === "true" || userId === "demo-user") {
    return "admin" // Allow admin preview in demo mode
  }

  try {
    const supabase = await createServerClient()
    const { data: roleRecord } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle()

    return roleRecord?.role || "user"
  } catch {
    return "user"
  }
}

export async function getUser(): Promise<UserWithRole | null> {
  if (process.env.VATIFY_DEMO_MODE === "true") {
    return {
      id: "demo-user",
      email: "demo@vatify.app",
      app_metadata: {},
      user_metadata: { name: "Thando" },
      aud: "authenticated",
      created_at: new Date(0).toISOString(),
      role: "admin",
    } as unknown as UserWithRole
  }

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const role = await getUserRole(user.id)
  return {
    ...user,
    role,
  }
}

export async function assignDefaultRole(userId: string, role: string = "user") {
  const supabase = await createServerClient()

  // Check if user already has a role
  const { data: existingRole } = await supabase.from("user_roles").select("*").eq("user_id", userId).maybeSingle()

  // If no role exists, assign specified or default role
  if (!existingRole) {
    const { error } = await supabase.from("user_roles").insert({
      user_id: userId,
      role,
    })

    if (error) {
      console.error("[Vatify Auth] Error assigning role:", error)
      return { success: false, error: error.message }
    }
  }

  return { success: true }
}

export async function getAllUsersWithRoles() {
  if (process.env.VATIFY_DEMO_MODE === "true") {
    return [
      { id: "1", email: "aj@vatify.co.za", role: "admin", status: "active", created_at: "2026-08-01" },
      { id: "2", email: "eddie@vatify.co.za", role: "admin", status: "active", created_at: "2026-08-02" },
      { id: "3", email: "boks@vatify.co.za", role: "admin", status: "active", created_at: "2026-08-03" },
      { id: "4", email: "warren@vatify.co.za", role: "admin", status: "active", created_at: "2026-08-04" },
      { id: "5", email: "demo@vatify.app", role: "user", status: "active", created_at: "2026-08-10" },
    ]
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("user_roles")
    .select("id, user_id, role, created_at")
    .order("id", { ascending: true })

  if (error || !data) {
    return []
  }

  return data.map((r) => ({
    id: String(r.id),
    email: r.user_id,
    role: r.role,
    status: "active",
    created_at: r.created_at || new Date().toISOString(),
  }))
}
