import { describe, it, expect } from 'vitest'
import { render, screen } from '../test/test-utils'
import Header from '../components/Header'

describe('Header Component', () => {
  it('renders the logo', () => {
    render(<Header />)
    
    // Check if the logo or brand name is present
    const logo = screen.getByText(/authencore/i)
    expect(logo).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header />)
    
    // Check for common navigation links
    const homeLink = screen.getByText(/home/i)
    expect(homeLink).toBeInTheDocument()
    
    const aboutLink = screen.getByText(/about/i)
    expect(aboutLink).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<Header />)
    
    const navigation = screen.getByRole('navigation')
    expect(navigation).toBeInTheDocument()
  })

  it('renders sign in button when user is not authenticated', () => {
    render(<Header />)
    
    // Should show sign in when not authenticated
    const signInButton = screen.getByRole('button', { name: /sign in/i })
    expect(signInButton).toBeInTheDocument()
  })
})