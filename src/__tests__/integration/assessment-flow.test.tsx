import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../utils/testSetup'
import { BrowserRouter } from 'react-router-dom'
import App from '../../App'

// Mock Supabase
vi.mock('../../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null })
        })
      }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockResolvedValue({ data: null, error: null })
    }),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: {}, error: null })
    }
  }
}))

// Mock router navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Assessment Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Complete Assessment Journey', () => {
    it('completes full career launch assessment flow', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )

      // Navigate to assessment page
      const assessmentLink = screen.getByRole('link', { name: /career launch/i })
      await user.click(assessmentLink)

      // Start assessment
      const startButton = screen.getByRole('button', { name: /start.*assessment/i })
      await user.click(startButton)

      // Should show first question
      await waitFor(() => {
        expect(screen.getByText(/question/i)).toBeInTheDocument()
      })

      // Answer first question
      const firstOption = screen.getByRole('radio', { name: /option/i })
      await user.click(firstOption)

      // Proceed to next question
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)

      // Continue until completion
      // (This would be expanded based on actual question count)

      // Complete assessment
      const finishButton = screen.getByRole('button', { name: /finish|complete/i })
      await user.click(finishButton)

      // Should show results
      await waitFor(() => {
        expect(screen.getByText(/results/i)).toBeInTheDocument()
      })
    })

    it('saves progress during assessment', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )

      // Start assessment
      const assessmentLink = screen.getByRole('link', { name: /career launch/i })
      await user.click(assessmentLink)

      const startButton = screen.getByRole('button', { name: /start.*assessment/i })
      await user.click(startButton)

      // Answer some questions
      const firstOption = screen.getByRole('radio', { name: /option/i })
      await user.click(firstOption)

      // Progress should be saved automatically
      await waitFor(() => {
        expect(localStorage.getItem('assessment_progress')).toBeTruthy()
      })
    })

    it('handles assessment interruption and resume', async () => {
      const user = userEvent.setup()
      
      // Set up existing progress
      localStorage.setItem('assessment_progress', JSON.stringify({
        currentQuestion: 5,
        responses: [
          { questionId: 'q1', answer: 'Option A' },
          { questionId: 'q2', answer: 'Option B' }
        ]
      }))

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )

      // Navigate to assessment
      const assessmentLink = screen.getByRole('link', { name: /career launch/i })
      await user.click(assessmentLink)

      // Should offer to resume
      expect(screen.getByText(/resume.*assessment/i)).toBeInTheDocument()

      const resumeButton = screen.getByRole('button', { name: /resume/i })
      await user.click(resumeButton)

      // Should continue from where left off
      expect(screen.getByText(/question.*6/i)).toBeInTheDocument()
    })
  })

  describe('Assessment Validation', () => {
    it('validates required responses', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )

      // Start assessment
      const assessmentLink = screen.getByRole('link', { name: /career launch/i })
      await user.click(assessmentLink)

      const startButton = screen.getByRole('button', { name: /start.*assessment/i })
      await user.click(startButton)

      // Try to proceed without answering
      const nextButton = screen.getByRole('button', { name: /next/i })
      expect(nextButton).toBeDisabled()

      // Show validation message
      await user.hover(nextButton)
      expect(screen.getByText(/please.*select/i)).toBeInTheDocument()
    })

    it('handles invalid response patterns', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )

      // Start assessment and answer all questions with same response
      const assessmentLink = screen.getByRole('link', { name: /career launch/i })
      await user.click(assessmentLink)

      const startButton = screen.getByRole('button', { name: /start.*assessment/i })
      await user.click(startButton)

      // Answer multiple questions with same option (straight-lining)
      for (let i = 0; i < 10; i++) {
        const option = screen.getByRole('radio', { name: /option.*a/i })
        await user.click(option)

        const nextButton = screen.getByRole('button', { name: /next/i })
        if (nextButton && !nextButton.disabled) {
          await user.click(nextButton)
        }
      }

      // Should show warning about response pattern
      expect(screen.getByText(/response.*pattern|validity.*concern/i)).toBeInTheDocument()
    })
  })

  describe('Assessment Results', () => {
    it('generates and displays comprehensive results', async () => {
      const user = userEvent.setup()
      
      // Mock assessment completion
      const mockAssessmentData = {
        type: 'career-launch',
        responses: [],
        scores: {
          personality: { openness: 85, conscientiousness: 75 },
          interests: { investigative: 90, artistic: 70 },
          values: { achievement: 95, independence: 85 }
        }
      }

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )

      // Navigate to results page
      window.history.pushState({}, '', '/assessment/results')

      await waitFor(() => {
        expect(screen.getByText(/assessment.*results/i)).toBeInTheDocument()
      })

      // Should show score breakdown
      expect(screen.getByText(/personality/i)).toBeInTheDocument()
      expect(screen.getByText(/interests/i)).toBeInTheDocument()
      expect(screen.getByText(/values/i)).toBeInTheDocument()

      // Should show career recommendations
      expect(screen.getByText(/recommended.*careers/i)).toBeInTheDocument()

      // Should show development areas
      expect(screen.getByText(/development.*areas/i)).toBeInTheDocument()
    })

    it('provides PDF download functionality', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )

      // Navigate to results
      window.history.pushState({}, '', '/assessment/results')

      await waitFor(() => {
        expect(screen.getByText(/assessment.*results/i)).toBeInTheDocument()
      })

      // Click download button
      const downloadButton = screen.getByRole('button', { name: /download.*pdf/i })
      await user.click(downloadButton)

      // Should trigger PDF generation
      await waitFor(() => {
        expect(screen.getByText(/generating.*pdf/i)).toBeInTheDocument()
      })
    })

    it('handles report sharing', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )

      // Navigate to results
      window.history.pushState({}, '', '/assessment/results')

      const shareButton = screen.getByRole('button', { name: /share/i })
      await user.click(shareButton)

      // Should show sharing options
      expect(screen.getByText(/share.*results/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /email/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /link/i })).toBeInTheDocument()
    })
  })

  describe('Multi-Assessment Flow', () => {
    it('handles multiple assessment types', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )

      // Complete Career Launch assessment
      let assessmentLink = screen.getByRole('link', { name: /career launch/i })
      await user.click(assessmentLink)

      // Complete assessment (simplified)
      const startButton = screen.getByRole('button', { name: /start/i })
      await user.click(startButton)

      // Navigate to Communication Styles assessment
      const homeLink = screen.getByRole('link', { name: /home/i })
      await user.click(homeLink)

      assessmentLink = screen.getByRole('link', { name: /communication/i })
      await user.click(assessmentLink)

      // Should start new assessment
      expect(screen.getByText(/communication.*assessment/i)).toBeInTheDocument()
    })

    it('tracks assessment history', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )

      // Navigate to dashboard/history
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
      if (dashboardLink) {
        await user.click(dashboardLink)

        // Should show completed assessments
        expect(screen.getByText(/assessment.*history/i)).toBeInTheDocument()
        expect(screen.getByText(/career.*launch/i)).toBeInTheDocument()
      }
    })
  })

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      // Mock network error
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'))

      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )

      const assessmentLink = screen.getByRole('link', { name: /career launch/i })
      await user.click(assessmentLink)

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/error.*occurred/i)).toBeInTheDocument()
      })

      // Should offer retry option
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })

    it('handles assessment timeout', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )

      // Start timed assessment
      const assessmentLink = screen.getByRole('link', { name: /career launch/i })
      await user.click(assessmentLink)

      const startButton = screen.getByRole('button', { name: /start/i })
      await user.click(startButton)

      // Mock timer expiration
      vi.useFakeTimers()
      vi.advanceTimersByTime(1800000) // 30 minutes

      await waitFor(() => {
        expect(screen.getByText(/time.*expired/i)).toBeInTheDocument()
      })

      vi.useRealTimers()
    })
  })

  describe('Accessibility', () => {
    it('supports keyboard navigation throughout assessment', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )

      // Navigate using keyboard
      await user.tab() // Focus first interactive element
      await user.keyboard('{Enter}') // Activate element

      // Should navigate through assessment using keyboard
      await user.tab() // Focus answer option
      await user.keyboard(' ') // Select option
      await user.tab() // Focus next button
      await user.keyboard('{Enter}') // Proceed to next question
    })

    it('provides proper ARIA labels and descriptions', () => {
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )

      // Check for accessibility attributes
      const assessmentSection = screen.getByRole('main')
      expect(assessmentSection).toHaveAttribute('aria-label')

      const progressIndicator = screen.getByRole('progressbar')
      if (progressIndicator) {
        expect(progressIndicator).toHaveAttribute('aria-valuenow')
        expect(progressIndicator).toHaveAttribute('aria-valuemax')
      }
    })
  })
})