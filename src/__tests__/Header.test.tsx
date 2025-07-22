import { describe, it, expect } from 'vitest'
import { render } from '../test/test-utils'
import Header from '../components/Header'

describe('Header Component', () => {
  it('renders the logo', () => {
    const { container } = render(<Header />)
    
    // Check if the logo or brand name is present
    expect(container.textContent).toMatch(/authencore/i)
  })

  it('renders navigation links', () => {
    const { container } = render(<Header />)
    
    // Check for common navigation links
    expect(container.textContent).toMatch(/home/i)
    expect(container.textContent).toMatch(/about/i)
  })

  it('has proper accessibility attributes', () => {
    const { container } = render(<Header />)
    
    const navigation = container.querySelector('nav')
    expect(navigation).toBeTruthy()
  })

  it('renders sign in button when user is not authenticated', () => {
    const { container } = render(<Header />)
    
    // Should show sign in when not authenticated
    expect(container.textContent).toMatch(/sign in/i)
  })
})