import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MobileNav } from '../components/mobile-nav'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('MobileNav Component', () => {
  it('renders the menu toggle button', () => {
    render(<MobileNav />)

    expect(screen.getByText('Toggle Menu')).toBeInTheDocument()
  })
})
