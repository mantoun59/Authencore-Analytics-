import { describe, it, expect, vi } from 'vitest'
import { render } from '../test/test-utils'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import userEvent from '@testing-library/user-event'

describe('UI Components', () => {
  describe('Button Component', () => {
    it('renders button with text', () => {
      const { container } = render(<Button>Click me</Button>)
      
      expect(container.textContent).toContain('Click me')
    })

    it('handles click events', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      
      const { container } = render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = container.querySelector('button')
      if (button) {
        await user.click(button)
        expect(handleClick).toHaveBeenCalledOnce()
      }
    })

    it('can be disabled', () => {
      const { container } = render(<Button disabled>Disabled button</Button>)
      
      const button = container.querySelector('button')
      expect(button?.disabled).toBe(true)
    })

    it('applies different variants', () => {
      const { container } = render(<Button variant="outline">Outline button</Button>)
      
      const button = container.querySelector('button')
      expect(button?.className).toMatch(/outline/)
    })
  })

  describe('Card Component', () => {
    it('renders card with content', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            Card content goes here
          </CardContent>
        </Card>
      )
      
      expect(container.textContent).toContain('Test Card')
      expect(container.textContent).toContain('Card content goes here')
    })

    it('has proper structure', () => {
      const { container } = render(
        <Card data-testid="card">
          <CardHeader data-testid="header">
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent data-testid="content">
            Content
          </CardContent>
        </Card>
      )
      
      expect(container.querySelector('[data-testid="card"]')).toBeTruthy()
      expect(container.querySelector('[data-testid="header"]')).toBeTruthy()
      expect(container.querySelector('[data-testid="content"]')).toBeTruthy()
    })
  })
})