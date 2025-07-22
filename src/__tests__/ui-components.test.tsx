import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../test/test-utils'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import userEvent from '@testing-library/user-event'

describe('UI Components', () => {
  describe('Button Component', () => {
    it('renders button with text', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
    })

    it('handles click events', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button', { name: /click me/i })
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledOnce()
    })

    it('can be disabled', () => {
      render(<Button disabled>Disabled button</Button>)
      
      const button = screen.getByRole('button', { name: /disabled button/i })
      expect(button).toBeDisabled()
    })

    it('applies different variants', () => {
      const { container } = render(<Button variant="outline">Outline button</Button>)
      
      const button = container.querySelector('button')
      expect(button).toHaveClass('outline')
    })
  })

  describe('Card Component', () => {
    it('renders card with content', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            Card content goes here
          </CardContent>
        </Card>
      )
      
      expect(screen.getByText('Test Card')).toBeInTheDocument()
      expect(screen.getByText('Card content goes here')).toBeInTheDocument()
    })

    it('has proper structure', () => {
      render(
        <Card data-testid="card">
          <CardHeader data-testid="header">
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent data-testid="content">
            Content
          </CardContent>
        </Card>
      )
      
      expect(screen.getByTestId('card')).toBeInTheDocument()
      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })
  })
})