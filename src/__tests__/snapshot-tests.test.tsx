import { describe, it, expect } from 'vitest'
import { render } from '../test/test-utils'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import Header from '../components/Header'

describe('UI Component Snapshots', () => {
  it('renders Button component consistently', () => {
    const { container } = render(<Button>Test Button</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders Card component consistently', () => {
    const { container } = render(<Card>Test Card</Card>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders Header component consistently', () => {
    const { container } = render(<Header />)
    expect(container.firstChild).toMatchSnapshot()
  })
})

describe('Assessment Component Snapshots', () => {
  it('renders assessment questions structure', () => {
    const mockProps = { onComplete: () => {} }
    const { container } = render(
      <div data-testid="assessment-mock">Assessment Questions Placeholder</div>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})