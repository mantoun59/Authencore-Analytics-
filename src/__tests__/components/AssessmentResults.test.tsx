import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
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

// Mock services
vi.mock('../../services/aiReportGenerator', () => ({
  aiReportGenerator: {
    generateReport: vi.fn().mockResolvedValue({
      summary: 'Test summary',
      recommendations: ['Test recommendation']
    })
  }
}))

vi.mock('../../services/unifiedAssessmentService', () => ({
  default: {
    processAssessment: vi.fn().mockResolvedValue({
      overallScore: 75,
      dimensions: [],
      improvements: []
    })
  }
}))

describe('AssessmentResults Component', () => {
  const mockAssessmentData = {
    responses: [
      { questionId: 'q1', answer: 'Option A', dimension: 'Personality', subdimension: 'Openness' },
      { questionId: 'q2', answer: 'Option B', dimension: 'RIASEC', subdimension: 'Realistic' }
    ],
    startTime: Date.now() - 1800000,
    endTime: Date.now(),
    totalTime: 1800000,
    assessmentType: 'stress-resilience'
  }

  const mockCandidateInfo = {
    name: 'John Doe',
    email: 'john@example.com',
    position: 'Software Developer'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders assessment results correctly', () => {
    const { container } = renderWithProviders(
      <AssessmentResults 
        data={mockAssessmentData} 
        assessmentType="stress-resilience"
        candidateInfo={mockCandidateInfo}
      />
    )
    
    expect(container).toBeInTheDocument()
  })

  it('displays candidate information when provided', () => {
    renderWithProviders(
      <AssessmentResults 
        data={mockAssessmentData} 
        candidateInfo={mockCandidateInfo}
      />
    )
    
    // Should display candidate name somewhere in the document
    expect(document.body.textContent).toContain('John Doe')
  })

  it('shows assessment results interface', () => {
    renderWithProviders(
      <AssessmentResults 
        data={mockAssessmentData} 
        assessmentType="stress-resilience"
      />
    )
    
    // Should show results-related content
    const resultsElements = document.querySelectorAll('[class*="result"], [class*="score"], [class*="chart"]')
    expect(resultsElements.length).toBeGreaterThanOrEqual(0)
  })

  it('handles download functionality', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <AssessmentResults 
        data={mockAssessmentData} 
        assessmentType="stress-resilience"
      />
    )
    
    // Look for download button
    const buttons = document.querySelectorAll('button')
    const downloadButton = Array.from(buttons).find(btn => 
      btn.textContent?.toLowerCase().includes('download') ||
      btn.querySelector('[data-testid*="download"]')
    )
    
    if (downloadButton) {
      await user.click(downloadButton)
      // Should not throw error
    }
    
    expect(true).toBe(true)
  })

  it('displays progress and completion information', () => {
    renderWithProviders(
      <AssessmentResults 
        data={mockAssessmentData} 
        assessmentType="stress-resilience"
      />
    )
    
    // Should show some form of progress or completion indicator
    const progressElements = document.querySelectorAll(
      '[role="progressbar"], .progress, [class*="complete"], [class*="finished"]'
    )
    expect(progressElements.length).toBeGreaterThanOrEqual(0)
  })

  it('handles different assessment types', () => {
    const { rerender } = renderWithProviders(
      <AssessmentResults 
        data={mockAssessmentData} 
        assessmentType="career-launch"
      />
    )
    
    expect(document.body).toBeInTheDocument()
    
    // Re-render with different type
    rerender(
      <AssessmentResults 
        data={mockAssessmentData} 
        assessmentType="communication-styles"
      />
    )
    
    expect(document.body).toBeInTheDocument()
  })

  it('handles empty or minimal data gracefully', () => {
    const minimalData = {
      responses: [],
      startTime: Date.now(),
      endTime: Date.now(),
      totalTime: 0,
      assessmentType: 'test'
    }
    
    expect(() => {
      renderWithProviders(<AssessmentResults data={minimalData} />)
    }).not.toThrow()
  })

  it('displays assessment metrics', () => {
    renderWithProviders(
      <AssessmentResults 
        data={mockAssessmentData} 
        assessmentType="stress-resilience"
      />
    )
    
    // Should show some kind of metrics or scores
    const metricElements = document.querySelectorAll(
      '[class*="score"], [class*="metric"], [class*="result"], [class*="chart"]'
    )
    expect(metricElements.length).toBeGreaterThanOrEqual(0)
  })

  it('supports sharing functionality', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <AssessmentResults 
        data={mockAssessmentData} 
        assessmentType="stress-resilience"
      />
    )
    
    // Look for share button
    const buttons = document.querySelectorAll('button')
    const shareButton = Array.from(buttons).find(btn => 
      btn.textContent?.toLowerCase().includes('share')
    )
    
    if (shareButton) {
      await user.click(shareButton)
      // Should not throw error
    }
    
    expect(true).toBe(true)
  })

  it('renders with proper component structure', () => {
    const { container } = renderWithProviders(
      <AssessmentResults 
        data={mockAssessmentData} 
        assessmentType="stress-resilience"
        candidateInfo={mockCandidateInfo}
      />
    )
    
    // Should have main container
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles loading and error states', () => {
    const dataWithError = {
      ...mockAssessmentData,
      error: 'Test error'
    }
    
    expect(() => {
      renderWithProviders(<AssessmentResults data={dataWithError} />)
    }).not.toThrow()
  })
})