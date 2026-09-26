// Database types for Supabase tables

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface UserRole {
  id: number
  user_id: string
  role: string
}

export interface OnboardingChecklist {
  id: number
  user_id: string
  completed: boolean
  checklist_items: ChecklistItem[]
  created_at: string
  updated_at: string
}

export interface ChecklistItem {
  id: string
  label: string
  completed: boolean
}

export interface DocumentUpload {
  id: number
  user_id: string
  cipc_document_url: string | null
  id_document_url: string | null
  tax_clearance_url: string | null
  power_of_attorney_url: string | null
  proof_of_address_url: string | null
  other_documents_url: string | null
  created_at: string
  updated_at: string
}

export interface UserOnboarding {
  id: number
  user_id: string
  contact_name: string
  contact_details: string
  company_name: string
  company_registration_number: string | null
  industry: string | null
  address: string
  id_number: string
  citizenship: "South African" | "Non South African"
  company_tax_number: string
  email_address: string
  mobile: string
  efiling_login_details: {
    username: string
    password: string
  } | null
  e_sign: boolean
  created_at: string
  updated_at: string
}

export interface UserInvoice {
  id: string
  user_id: string
  file_name: string
  file_url: string
  file_size: number | null
  invoice_number: string | null
  invoice_date: string | null
  due_date: string | null
  supplier_name: string | null
  supplier_address: string | null
  supplier_vat_number: string | null
  total_amount: number | null
  vat_amount: number | null
  net_amount: number | null
  currency: string | null
  line_items: Json[] | null
  extracted_data: Record<string, Json> | null
  status: string | null
  processing_notes: string | null
  created_at: string | null
  updated_at: string | null
}
