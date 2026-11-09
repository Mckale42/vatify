"use server"

import { createServerClient } from "@/lib/supabase/server"
import type { UserOnboarding } from "@/lib/types/database"

export async function saveCompanyDetails(data: {
  contactName: string
  contactDetails: string
  companyName: string
  companyRegistrationNumber: string
  industry: string
  address: string
  idNumber: string
  citizenship: "South African" | "Non South African"
  companyTaxNumber: string
  emailAddress: string
  mobile: string
  efilingUsername: string
  efilingPassword: string
  eSign: boolean
}) {
  try {
    const supabase = await createServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    const { data: existing, error: fetchError } = await supabase
      .from("user_onboarding")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()

    if (fetchError) {
      console.error("Error checking existing data:", fetchError)
      return { success: false, error: "Failed to check existing data" }
    }

    const onboardingData = {
      user_id: user.id,
      contact_name: data.contactName,
      contact_details: data.contactDetails,
      company_name: data.companyName,
      address: data.address,
      id_number: data.idNumber,
      citizenship: data.citizenship,
      company_tax_number: data.companyTaxNumber,
      email_address: data.emailAddress,
      mobile: data.mobile,
      efiling_login_details: {
        username: data.efilingUsername,
        password: data.efilingPassword,
      },
      e_sign: data.eSign,
      updated_at: new Date().toISOString(),
    }

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("user_onboarding")
        .update(onboardingData)
        .eq("user_id", user.id)

      if (updateError) {
        console.error("Error updating onboarding data:", updateError)
        return { success: false, error: "Failed to update company details" }
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase.from("user_onboarding").insert({
        ...onboardingData,
        created_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("Error inserting onboarding data:", insertError)
        return { success: false, error: "Failed to save company details" }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error saving company details:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getCompanyDetails() {
  try {
    const supabase = await createServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    const { data, error } = await supabase.from("user_onboarding").select("*").eq("user_id", user.id).maybeSingle()

    if (error) {
      console.error("Error fetching company details:", error)
      return { success: false, error: "Failed to fetch company details" }
    }

    return { success: true, data: data as UserOnboarding | null }
  } catch (error) {
    console.error("Error fetching company details:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
