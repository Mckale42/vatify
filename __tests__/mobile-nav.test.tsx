import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MobileNav } from '../components/mobile-nav'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}))

describe('MobileNav Component', () => {
  it('renders all key navigation links', () => {
    render(<MobileNav />)

    expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Invoices')).toBeInTheDocument()
    expect(screen.getByText('VAT')).toBeInTheDocument()
    expect(screen.getByText('Chat')).toBeInTheDocument()
    expect(screen.getByText('More')).toBeInTheDocument()
  })

  it('contains correct href targets', () => {
    render(<MobileNav />)

    const homeLink = screen.getByText('Home').closest('a')
    const invoicesLink = screen.getByText('Invoices').closest('a')
    const vatLink = screen.getByText('VAT').closest('a')

    expect(homeLink).toHaveAttribute('href', '/dashboard')
    expect(invoicesLink).toHaveAttribute('href', '/dashboard/invoices')
    expect(vatLink).toHaveAttribute('href', '/dashboard/processed')
  })
})
