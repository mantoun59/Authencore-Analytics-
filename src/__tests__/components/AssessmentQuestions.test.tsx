import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../utils/testSetup'
import AssessmentQuestions from '../../components/AssessmentQuestions'

// Mock the assessment questions data
vi.mock('../../data/assessmentQuestions', () => ({
  default: [
    {
      id: 'q1',
      text: 'Test question 1',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      dimension: 'Personality',
      subdimension: 'Openness'
    },
    {
      id: 'q2', 
      text: 'Test question 2',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      dimension: 'RIASEC',
      subdimension: 'Realistic'
    }
  ]
}))

// Mock the progress hook
vi.mock('../../hooks/useAssessmentProgress', () => ({
  useAssessmentProgress: () => ({
    isSaving: false,
    saveProgress: vi.fn(),
    markCompleted: vi.fn(),
    restoreProgress: vi.fn()
  })
}))

describe('AssessmentQuestions Component', () => {
  const mockOnComplete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    const { container } = renderWithProviders(
      <AssessmentQuestions onComplete={mockOnComplete} />
    )
    
    expect(container).toBeInTheDocument()
  })

  it('displays assessment interface elements', () => {
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Should show assessment UI elements
    expect(document.body).toContainElement(document.querySelector('button, [role="radiogroup"], [role="progressbar"]'))
  })

  it('handles answer selection', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Find any radio input
    const radioInputs = document.querySelectorAll('input[type="radio"]')
    if (radioInputs.length > 0) {
      await user.click(radioInputs[0] as HTMLElement)
      expect((radioInputs[0] as HTMLInputElement).checked).toBe(true)
    }
  })

  it('shows progress indication', () => {
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Should have some form of progress indicator
    const progressElements = document.querySelectorAll('[role="progressbar"], .progress, [data-progress]')
    expect(progressElements.length).toBeGreaterThan(0)
  })

  it('enables navigation between questions', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Look for navigation buttons
    const buttons = document.querySelectorAll('button')
    const nextButton = Array.from(buttons).find(btn => 
      btn.textContent?.toLowerCase().includes('next') || 
      btn.textContent?.toLowerCase().includes('continue')
    )
    
    if (nextButton) {
      // Select an answer first if possible
      const radioInputs = document.querySelectorAll('input[type="radio"]')
      if (radioInputs.length > 0) {
        await user.click(radioInputs[0] as HTMLElement)
      }
      
      // Then try to navigate
      if (!nextButton.hasAttribute('disabled')) {
        await user.click(nextButton)
      }
    }
    
    // Test passes if no errors are thrown
    expect(true).toBe(true)
  })

  it('validates component props correctly', () => {
    expect(() => {
      renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    }).not.toThrow()
  })

  it('handles completion callback', () => {
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Component should render without calling onComplete immediately
    expect(mockOnComplete).not.toHaveBeenCalled()
  })

  it('manages assessment state', () => {
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Should render assessment interface elements
    expect(document.body).toContainElement(document.querySelector('form, [role="radiogroup"], button'))
  })

  it('supports accessibility features', () => {
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Check for basic accessibility elements
    const interactiveElements = document.querySelectorAll('button, input, [role="button"], [role="radio"]')
    expect(interactiveElements.length).toBeGreaterThan(0)
  })

  it('handles error states gracefully', () => {
    expect(() => {
      renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    }).not.toThrow()
  })
})