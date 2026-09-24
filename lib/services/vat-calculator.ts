/**
 * South African Value-Added Tax (VAT) Calculation & Compliance Engine
 * Governed by the Value-Added Tax Act, No. 89 of 1991
 */

export const SA_VAT_RATE = 0.15 // 15% standard rate

export type VatCategory = 'standard' | 'zero_rated' | 'exempt'

export interface VatCalculationResult {
  netAmount: number
  vatAmount: number
  totalAmount: number
  vatRate: number
  category: VatCategory
}

export interface InvoiceIntegrityCheck {
  isValid: boolean
  calculatedVat: number
  calculatedTotal: number
  discrepancy: number
  reason?: string
}

export interface SarsComplianceCheck {
  isCompliant: boolean
  missingRequirements: string[]
  score: number // percentage compliance
}

/**
 * Calculates VAT and Total from a Net (exclusive) amount
 */
export function calculateVatFromNet(
  netAmount: number,
  category: VatCategory = 'standard'
): VatCalculationResult {
  if (netAmount < 0) {
    throw new Error('Net amount cannot be negative')
  }

  const rate = category === 'standard' ? SA_VAT_RATE : 0
  const rawVat = netAmount * rate
  const vatAmount = Math.round(rawVat * 100) / 100
  const totalAmount = Math.round((netAmount + vatAmount) * 100) / 100

  return {
    netAmount: Math.round(netAmount * 100) / 100,
    vatAmount,
    totalAmount,
    vatRate: rate,
    category,
  }
}

/**
 * Extracts Net amount and VAT from a gross (inclusive) total amount
 */
export function extractVatFromTotal(
  totalAmount: number,
  category: VatCategory = 'standard'
): VatCalculationResult {
  if (totalAmount < 0) {
    throw new Error('Total amount cannot be negative')
  }

  if (category !== 'standard') {
    return {
      netAmount: Math.round(totalAmount * 100) / 100,
      vatAmount: 0,
      totalAmount: Math.round(totalAmount * 100) / 100,
      vatRate: 0,
      category,
    }
  }

  const netAmount = Math.round((totalAmount / (1 + SA_VAT_RATE)) * 100) / 100
  const vatAmount = Math.round((totalAmount - netAmount) * 100) / 100

  return {
    netAmount,
    vatAmount,
    totalAmount: Math.round(totalAmount * 100) / 100,
    vatRate: SA_VAT_RATE,
    category: 'standard',
  }
}

/**
 * Validates the arithmetic integrity of an invoice
 * Checks if Net + VAT = Total within a 5-cent rounding tolerance
 */
export function validateInvoiceIntegrity(
  netAmount: number,
  vatAmount: number,
  totalAmount: number
): InvoiceIntegrityCheck {
  const sum = Math.round((netAmount + vatAmount) * 100) / 100
  const roundedTotal = Math.round(totalAmount * 100) / 100
  const discrepancy = Math.abs(Math.round((roundedTotal - sum) * 100) / 100)

  if (discrepancy > 0.05) {
    return {
      isValid: false,
      calculatedVat: Math.round(netAmount * SA_VAT_RATE * 100) / 100,
      calculatedTotal: sum,
      discrepancy,
      reason: `Net amount (R${netAmount}) + VAT (R${vatAmount}) does not match Total (R${totalAmount}). Discrepancy: R${discrepancy}`,
    }
  }

  return {
    isValid: true,
    calculatedVat: vatAmount,
    calculatedTotal: roundedTotal,
    discrepancy: 0,
  }
}

/**
 * Validates SARS Section 20(4) Tax Invoice mandatory requirements
 */
export function validateSarsInvoiceCompliance(invoice: {
  invoiceNumber?: string | null
  invoiceDate?: string | null
  supplierName?: string | null
  supplierVatNumber?: string | null
  totalAmount?: number | null
  vatAmount?: number | null
}): SarsComplianceCheck {
  const missing: string[] = []

  if (!invoice.supplierName || invoice.supplierName.trim().length === 0) {
    missing.push('Supplier Name is required')
  }

  // South African VAT registration numbers are 10 digits starting with 4
  if (!invoice.supplierVatNumber) {
    missing.push('Supplier VAT Number is required')
  } else {
    const cleanVat = invoice.supplierVatNumber.replace(/\D/g, '')
    if (cleanVat.length !== 10 || !cleanVat.startsWith('4')) {
      missing.push('Invalid SARS VAT Number format (Must be 10 digits starting with 4)')
    }
  }

  if (!invoice.invoiceNumber || invoice.invoiceNumber.trim().length === 0) {
    missing.push('Serialized Invoice Number is required')
  }

  if (!invoice.invoiceDate) {
    missing.push('Date of issue is required')
  }

  if (invoice.totalAmount === undefined || invoice.totalAmount === null || invoice.totalAmount <= 0) {
    missing.push('Valid total amount is required')
  }

  const totalCriteria = 5
  const passedCriteria = totalCriteria - missing.length
  const score = Math.max(0, Math.round((passedCriteria / totalCriteria) * 100))

  return {
    isCompliant: missing.length === 0,
    missingRequirements: missing,
    score,
  }
}
