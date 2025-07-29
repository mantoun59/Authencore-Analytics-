import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../utils/testSetup'
import AssessmentResults from '../../components/AssessmentResults'

// Mock jsPDF
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    text: vi.fn(),
    addPage: vi.fn(),
    save: vi.fn(),
    setFontSize: vi.fn(),
    setTextColor: vi.fn(),
    setFont: vi.fn(),
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297
      }
    }
  }))
}))

// Mock chart.js
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn()
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  BarElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn()
}))

describe('AssessmentResults Component', () => {
  const mockAssessmentData = {
    type: 'career-launch',
    responses: [
      { questionId: 'q1', answer: 'Option A', dimension: 'Personality', subdimension: 'Openness' },
      { questionId: 'q2', answer: 'Option B', dimension: 'RIASEC', subdimension: 'Realistic' }
    ],
    scores: {
      personality: {
        openness: 85,
        conscientiousness: 75,
        extraversion: 65,
        agreeableness: 80,
        neuroticism: 30
      },
      interests: {
        realistic: 60,
        investigative: 85,
        artistic: 70,
        social: 75,
        enterprising: 80,
        conventional: 55
      },
      values: {
        achievement: 90,
        independence: 85,
        recognition: 70,
        relationships: 65,
        support: 60,
        working_conditions: 70
      }
    },
    candidateInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      position: 'Software Developer'
    },
    completedAt: new Date().toISOString(),
    totalTime: 1800000 // 30 minutes
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders assessment results correctly', () => {
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    expect(screen.getByText(/assessment results/i)).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('displays personality scores with proper formatting', () => {
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    expect(screen.getByText(/openness/i)).toBeInTheDocument()
    expect(screen.getByText(/conscientiousness/i)).toBeInTheDocument()
    expect(screen.getByText(/extraversion/i)).toBeInTheDocument()
    expect(screen.getByText(/agreeableness/i)).toBeInTheDocument()
    expect(screen.getByText(/neuroticism/i)).toBeInTheDocument()
  })

  it('shows career interest scores', () => {
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    expect(screen.getByText(/realistic/i)).toBeInTheDocument()
    expect(screen.getByText(/investigative/i)).toBeInTheDocument()
    expect(screen.getByText(/artistic/i)).toBeInTheDocument()
    expect(screen.getByText(/social/i)).toBeInTheDocument()
    expect(screen.getByText(/enterprising/i)).toBeInTheDocument()
    expect(screen.getByText(/conventional/i)).toBeInTheDocument()
  })

  it('displays work values scores', () => {
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    expect(screen.getByText(/achievement/i)).toBeInTheDocument()
    expect(screen.getByText(/independence/i)).toBeInTheDocument()
    expect(screen.getByText(/recognition/i)).toBeInTheDocument()
  })

  it('shows overall assessment summary', () => {
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    expect(screen.getByText(/summary/i)).toBeInTheDocument()
    expect(screen.getByText(/career readiness/i)).toBeInTheDocument()
  })

  it('displays career recommendations', () => {
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    expect(screen.getByText(/recommended careers/i)).toBeInTheDocument()
    expect(screen.getByText(/software/i)).toBeInTheDocument()
  })

  it('shows development areas', () => {
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    expect(screen.getByText(/development/i)).toBeInTheDocument()
    expect(screen.getByText(/areas.*improvement/i)).toBeInTheDocument()
  })

  it('displays action plan', () => {
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    expect(screen.getByText(/action plan/i)).toBeInTheDocument()
    expect(screen.getByText(/next steps/i)).toBeInTheDocument()
  })

  it('provides PDF download functionality', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    const downloadButton = screen.getByRole('button', { name: /download.*pdf/i })
    expect(downloadButton).toBeInTheDocument()
    
    await user.click(downloadButton)
    // PDF generation should be triggered (mocked)
  })

  it('handles email report functionality', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    const emailButton = screen.getByRole('button', { name: /email.*report/i })
    if (emailButton) {
      await user.click(emailButton)
      // Email functionality should be triggered
    }
  })

  it('displays assessment completion time', () => {
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    expect(screen.getByText(/completion time/i)).toBeInTheDocument()
    expect(screen.getByText(/30.*minutes/i)).toBeInTheDocument()
  })

  it('shows percentile rankings', () => {
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    expect(screen.getByText(/percentile/i)).toBeInTheDocument()
    expect(screen.getByText(/85th|75th|90th/)).toBeInTheDocument()
  })

  it('renders score visualizations', () => {
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    // Should have chart elements
    const charts = screen.getAllByRole('img') // Canvas elements appear as img in tests
    expect(charts.length).toBeGreaterThan(0)
  })

  it('handles missing scores gracefully', () => {
    const incompleteData = {
      ...mockAssessmentData,
      scores: {}
    }
    
    renderWithProviders(<AssessmentResults assessmentData={incompleteData} />)
    
    expect(screen.getByText(/assessment results/i)).toBeInTheDocument()
  })

  it('displays confidence intervals for scores', () => {
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    expect(screen.getByText(/confidence/i)).toBeInTheDocument()
    expect(screen.getByText(/±.*points/i)).toBeInTheDocument()
  })

  it('shows score interpretations', () => {
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    expect(screen.getByText(/high|moderate|low/i)).toBeInTheDocument()
    expect(screen.getByText(/strength|average|development/i)).toBeInTheDocument()
  })

  it('provides detailed score explanations', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    const moreInfoButton = screen.getByRole('button', { name: /more.*info|details/i })
    if (moreInfoButton) {
      await user.click(moreInfoButton)
      expect(screen.getByText(/detailed.*explanation/i)).toBeInTheDocument()
    }
  })

  it('handles different assessment types correctly', () => {
    const communicationData = {
      ...mockAssessmentData,
      type: 'communication-styles',
      scores: {
        assertiveness: 85,
        expressiveness: 70,
        listening: 80,
        adaptability: 75
      }
    }
    
    renderWithProviders(<AssessmentResults assessmentData={communicationData} />)
    
    expect(screen.getByText(/communication/i)).toBeInTheDocument()
    expect(screen.getByText(/assertiveness/i)).toBeInTheDocument()
  })

  it('displays validity indicators', () => {
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    expect(screen.getByText(/validity/i)).toBeInTheDocument()
    expect(screen.getByText(/reliable|valid/i)).toBeInTheDocument()
  })

  it('shows comparison to normative data', () => {
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    expect(screen.getByText(/compared.*to/i)).toBeInTheDocument()
    expect(screen.getByText(/population|peers|norm/i)).toBeInTheDocument()
  })

  it('provides sharing functionality', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AssessmentResults assessmentData={mockAssessmentData} />)
    
    const shareButton = screen.getByRole('button', { name: /share/i })
    if (shareButton) {
      await user.click(shareButton)
      // Share functionality should be available
    }
  })

  it('handles loading states during report generation', async () => {
    const loadingData = { ...mockAssessmentData, isGenerating: true }
    
    renderWithProviders(<AssessmentResults assessmentData={loadingData} />)
    
    expect(screen.getByText(/generating|loading/i)).toBeInTheDocument()
  })

  it('displays error states appropriately', () => {
    const errorData = { ...mockAssessmentData, hasError: true }
    
    renderWithProviders(<AssessmentResults assessmentData={errorData} />)
    
    if (errorData.hasError) {
      expect(screen.getByText(/error|problem/i)).toBeInTheDocument()
    }
  })
})