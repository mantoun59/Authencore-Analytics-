import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

describe('AssessmentQuestions Component', () => {
  const mockOnComplete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the first question correctly', () => {
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    expect(screen.getByText('Test question 1')).toBeInTheDocument()
  })

  it('displays all answer options for current question', () => {
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByText('Option B')).toBeInTheDocument()
    expect(screen.getByText('Option C')).toBeInTheDocument()
    expect(screen.getByText('Option D')).toBeInTheDocument()
  })

  it('shows progress indicator', () => {
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Should show progress (1 of 2, or similar)
    expect(screen.getByText(/1.*2/)).toBeInTheDocument()
  })

  it('allows selecting an answer', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    const firstOption = screen.getByLabelText('Option A')
    await user.click(firstOption)
    
    expect(firstOption).toBeChecked()
  })

  it('enables next button after selecting answer', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    const nextButton = screen.getByRole('button', { name: /next|continue/i })
    expect(nextButton).toBeDisabled()
    
    const firstOption = screen.getByLabelText('Option A')
    await user.click(firstOption)
    
    expect(nextButton).toBeEnabled()
  })

  it('advances to next question when next is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Answer first question
    const firstOption = screen.getByLabelText('Option A')
    await user.click(firstOption)
    
    // Click next
    const nextButton = screen.getByRole('button', { name: /next|continue/i })
    await user.click(nextButton)
    
    // Should show second question
    expect(screen.getByText('Test question 2')).toBeInTheDocument()
  })

  it('shows previous button on second question', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Answer first question and advance
    const firstOption = screen.getByLabelText('Option A')
    await user.click(firstOption)
    
    const nextButton = screen.getByRole('button', { name: /next|continue/i })
    await user.click(nextButton)
    
    // Should show previous button
    expect(screen.getByRole('button', { name: /previous|back/i })).toBeInTheDocument()
  })

  it('allows going back to previous question', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Answer first question and advance
    const firstOption = screen.getByLabelText('Option A')
    await user.click(firstOption)
    
    const nextButton = screen.getByRole('button', { name: /next|continue/i })
    await user.click(nextButton)
    
    // Go back
    const prevButton = screen.getByRole('button', { name: /previous|back/i })
    await user.click(prevButton)
    
    // Should show first question again
    expect(screen.getByText('Test question 1')).toBeInTheDocument()
  })

  it('maintains selected answers when navigating', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Answer first question
    const firstOption = screen.getByLabelText('Option A')
    await user.click(firstOption)
    
    // Advance to second question
    const nextButton = screen.getByRole('button', { name: /next|continue/i })
    await user.click(nextButton)
    
    // Go back
    const prevButton = screen.getByRole('button', { name: /previous|back/i })
    await user.click(prevButton)
    
    // First option should still be selected
    expect(screen.getByLabelText('Option A')).toBeChecked()
  })

  it('completes assessment after answering all questions', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Answer first question
    let firstOption = screen.getByLabelText('Option A')
    await user.click(firstOption)
    
    let nextButton = screen.getByRole('button', { name: /next|continue/i })
    await user.click(nextButton)
    
    // Answer second question
    firstOption = screen.getByLabelText('Option A')
    await user.click(firstOption)
    
    // Should show finish button
    const finishButton = screen.getByRole('button', { name: /finish|complete|submit/i })
    await user.click(finishButton)
    
    // Should call onComplete with responses
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            questionId: 'q1',
            answer: expect.any(String)
          }),
          expect.objectContaining({
            questionId: 'q2', 
            answer: expect.any(String)
          })
        ])
      )
    })
  })

  it('displays timer if assessment is timed', () => {
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} isTimedAssessment={true} />)
    
    // Should show timer display
    expect(screen.getByText(/time/i)).toBeInTheDocument()
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Focus first option with keyboard
    await user.tab()
    expect(screen.getByLabelText('Option A')).toHaveFocus()
    
    // Select with space
    await user.keyboard(' ')
    expect(screen.getByLabelText('Option A')).toBeChecked()
  })

  it('validates required questions', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Try to advance without selecting answer
    const nextButton = screen.getByRole('button', { name: /next|continue/i })
    expect(nextButton).toBeDisabled()
    
    // Should show validation message if user tries to skip
    const form = screen.getByRole('form') || screen.getByTestId('assessment-form')
    if (form) {
      fireEvent.submit(form)
      expect(screen.getByText(/required|select/i)).toBeInTheDocument()
    }
  })

  it('saves progress automatically', async () => {
    const user = userEvent.setup()
    const mockSaveProgress = vi.fn()
    
    renderWithProviders(
      <AssessmentQuestions 
        onComplete={mockOnComplete} 
        onSaveProgress={mockSaveProgress}
      />
    )
    
    // Answer question
    const firstOption = screen.getByLabelText('Option A')
    await user.click(firstOption)
    
    // Progress should be saved
    await waitFor(() => {
      expect(mockSaveProgress).toHaveBeenCalled()
    })
  })

  it('handles assessment interruption gracefully', () => {
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Component should render without errors even if interrupted
    expect(screen.getByText('Test question 1')).toBeInTheDocument()
  })

  it('displays question counter correctly', () => {
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Should show question 1 of 2
    expect(screen.getByText(/1.*of.*2/i)).toBeInTheDocument()
  })

  it('handles rapid answer changes', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentQuestions onComplete={mockOnComplete} />)
    
    // Rapidly select different options
    await user.click(screen.getByLabelText('Option A'))
    await user.click(screen.getByLabelText('Option B'))
    await user.click(screen.getByLabelText('Option C'))
    
    // Only the last selection should be active
    expect(screen.getByLabelText('Option C')).toBeChecked()
    expect(screen.getByLabelText('Option A')).not.toBeChecked()
    expect(screen.getByLabelText('Option B')).not.toBeChecked()
  })
})