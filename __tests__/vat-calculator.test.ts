import { describe, it, expect } from 'vitest'
import {
  calculateVatFromNet,
  extractVatFromTotal,
  validateInvoiceIntegrity,
  validateSarsInvoiceCompliance,
  SA_VAT_RATE,
} from '../lib/services/vat-calculator'

describe('VAT Calculator Service (South African VAT Act 89 of 1991)', () => {
  describe('calculateVatFromNet', () => {
    it('calculates 15% standard VAT correctly for whole amounts', () => {
      const result = calculateVatFromNet(1000)
      expect(result.netAmount).toBe(1000)
      expect(result.vatAmount).toBe(150)
      expect(result.totalAmount).toBe(1150)
      expect(result.vatRate).toBe(0.15)
      expect(result.category).toBe('standard')
    })

    it('calculates VAT correctly with rounding to 2 decimal places', () => {
      const result = calculateVatFromNet(123.45)
      // 123.45 * 0.15 = 18.5175 -> 18.52
      expect(result.vatAmount).toBe(18.52)
      expect(result.totalAmount).toBe(141.97)
    })

    it('handles zero-rated supplies with 0% VAT', () => {
      const result = calculateVatFromNet(500, 'zero_rated')
      expect(result.netAmount).toBe(500)
      expect(result.vatAmount).toBe(0)
      expect(result.totalAmount).toBe(500)
      expect(result.category).toBe('zero_rated')
    })

    it('handles exempt supplies with 0% VAT', () => {
      const result = calculateVatFromNet(2500, 'exempt')
      expect(result.netAmount).toBe(2500)
      expect(result.vatAmount).toBe(0)
      expect(result.totalAmount).toBe(2500)
      expect(result.category).toBe('exempt')
    })

    it('throws an error for negative amounts', () => {
      expect(() => calculateVatFromNet(-100)).toThrow('Net amount cannot be negative')
    })
  })

  describe('extractVatFromTotal (Reverse VAT)', () => {
    it('extracts net and VAT correctly from inclusive total', () => {
      const result = extractVatFromTotal(1150)
      expect(result.netAmount).toBe(1000)
      expect(result.vatAmount).toBe(150)
      expect(result.totalAmount).toBe(1150)
    })

    it('extracts VAT accurately with decimal rounding', () => {
      const result = extractVatFromTotal(500)
      // 500 / 1.15 = 434.7826 -> 434.78
      // VAT = 500 - 434.78 = 65.22
      expect(result.netAmount).toBe(434.78)
      expect(result.vatAmount).toBe(65.22)
      expect(result.totalAmount).toBe(500)
    })

    it('throws error for negative total', () => {
      expect(() => extractVatFromTotal(-50)).toThrow('Total amount cannot be negative')
    })
  })

  describe('validateInvoiceIntegrity', () => {
    it('passes when Net + VAT exactly equals Total', () => {
      const check = validateInvoiceIntegrity(1000, 150, 1150)
      expect(check.isValid).toBe(true)
      expect(check.discrepancy).toBe(0)
    })

    it('passes when discrepancy is within the 5-cent rounding threshold', () => {
      const check = validateInvoiceIntegrity(100, 15.02, 115)
      expect(check.isValid).toBe(true)
    })

    it('fails when discrepancy exceeds 5 cents', () => {
      const check = validateInvoiceIntegrity(1000, 100, 1150)
      expect(check.isValid).toBe(false)
      expect(check.discrepancy).toBe(50)
      expect(check.reason).toContain('does not match Total')
    })
  })

  describe('validateSarsInvoiceCompliance', () => {
    it('validates a complete, compliant tax invoice', () => {
      const invoice = {
        supplierName: 'Makro SA (Pty) Ltd',
        supplierVatNumber: '4123456789',
        invoiceNumber: 'INV-2026-0091',
        invoiceDate: '2026-09-20',
        totalAmount: 3450.0,
        vatAmount: 450.0,
      }

      const compliance = validateSarsInvoiceCompliance(invoice)
      expect(compliance.isCompliant).toBe(true)
      expect(compliance.missingRequirements).toHaveLength(0)
      expect(compliance.score).toBe(100)
    })

    it('detects invalid SARS VAT registration numbers (not 10 digits or not starting with 4)', () => {
      const invoice = {
        supplierName: 'Tech Supplies',
        supplierVatNumber: '123456789', // Invalid: 9 digits, starts with 1
        invoiceNumber: 'INV-101',
        invoiceDate: '2026-09-20',
        totalAmount: 1150.0,
      }

      const compliance = validateSarsInvoiceCompliance(invoice)
      expect(compliance.isCompliant).toBe(false)
      expect(compliance.missingRequirements).toContain(
        'Invalid SARS VAT Number format (Must be 10 digits starting with 4)'
      )
    })

    it('reports missing mandatory fields accurately', () => {
      const invoice = {
        supplierName: '',
        supplierVatNumber: null,
        invoiceNumber: '',
        invoiceDate: null,
        totalAmount: 0,
      }

      const compliance = validateSarsInvoiceCompliance(invoice)
      expect(compliance.isCompliant).toBe(false)
      expect(compliance.missingRequirements.length).toBeGreaterThanOrEqual(4)
      expect(compliance.score).toBe(0)
    })
  })
})
