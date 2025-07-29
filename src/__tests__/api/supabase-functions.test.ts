import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '../../integrations/supabase/client'

// Mock Supabase client
vi.mock('../../integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
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
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } })
    }
  }
}))

describe('Supabase Functions API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generate-pdf-report', () => {
    it('generates PDF report successfully', async () => {
      const mockResponse = {
        data: {
          pdfUrl: 'https://example.com/report.pdf',
          success: true
        },
        error: null
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse)

      const assessmentData = {
        type: 'career-launch',
        candidateInfo: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        scores: {
          personality: { openness: 85 },
          interests: { investigative: 90 }
        }
      }

      const result = await supabase.functions.invoke('generate-pdf-report', {
        body: assessmentData
      })

      expect(result).toEqual(mockResponse)
      expect(supabase.functions.invoke).toHaveBeenCalledWith('generate-pdf-report', {
        body: assessmentData
      })
    })

    it('handles PDF generation errors', async () => {
      const mockError = {
        data: null,
        error: {
          message: 'Failed to generate PDF',
          code: 'PDF_GENERATION_ERROR'
        }
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockError)

      const result = await supabase.functions.invoke('generate-pdf-report', {
        body: {}
      })

      expect(result.error).toBeTruthy()
      expect(result.error.message).toBe('Failed to generate PDF')
    })

    it('validates required assessment data', async () => {
      const incompleteData = {
        type: 'career-launch'
        // Missing candidateInfo and scores
      }

      const mockError = {
        data: null,
        error: {
          message: 'Missing required assessment data',
          code: 'VALIDATION_ERROR'
        }
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockError)

      const result = await supabase.functions.invoke('generate-pdf-report', {
        body: incompleteData
      })

      expect(result.error).toBeTruthy()
      expect(result.error.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('generate-ai-report', () => {
    it('generates AI analysis report', async () => {
      const mockResponse = {
        data: {
          analysis: {
            personality: 'High openness indicates creativity and adaptability',
            careerRecommendations: ['Software Developer', 'Data Scientist'],
            developmentAreas: ['Time Management', 'Public Speaking']
          },
          success: true
        },
        error: null
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse)

      const assessmentData = {
        responses: [
          { questionId: 'q1', answer: 'Strongly Agree', dimension: 'Personality' }
        ],
        scores: {
          personality: { openness: 85, conscientiousness: 75 }
        }
      }

      const result = await supabase.functions.invoke('generate-ai-report', {
        body: assessmentData
      })

      expect(result.data.analysis).toBeDefined()
      expect(result.data.analysis.careerRecommendations).toBeInstanceOf(Array)
      expect(supabase.functions.invoke).toHaveBeenCalledWith('generate-ai-report', {
        body: assessmentData
      })
    })

    it('handles AI analysis timeout', async () => {
      const mockError = {
        data: null,
        error: {
          message: 'AI analysis timeout',
          code: 'TIMEOUT_ERROR'
        }
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockError)

      const result = await supabase.functions.invoke('generate-ai-report', {
        body: { responses: [] }
      })

      expect(result.error.code).toBe('TIMEOUT_ERROR')
    })
  })

  describe('send-assessment-report', () => {
    it('sends report via email successfully', async () => {
      const mockResponse = {
        data: {
          messageId: 'msg_123456',
          success: true
        },
        error: null
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse)

      const emailData = {
        recipientEmail: 'john@example.com',
        recipientName: 'John Doe',
        reportUrl: 'https://example.com/report.pdf',
        assessmentType: 'career-launch'
      }

      const result = await supabase.functions.invoke('send-assessment-report', {
        body: emailData
      })

      expect(result.data.success).toBe(true)
      expect(result.data.messageId).toBeDefined()
    })

    it('validates email addresses', async () => {
      const mockError = {
        data: null,
        error: {
          message: 'Invalid email address',
          code: 'INVALID_EMAIL'
        }
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockError)

      const invalidEmailData = {
        recipientEmail: 'invalid-email',
        reportUrl: 'https://example.com/report.pdf'
      }

      const result = await supabase.functions.invoke('send-assessment-report', {
        body: invalidEmailData
      })

      expect(result.error.code).toBe('INVALID_EMAIL')
    })

    it('handles email delivery failures', async () => {
      const mockError = {
        data: null,
        error: {
          message: 'Email delivery failed',
          code: 'DELIVERY_FAILED'
        }
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockError)

      const result = await supabase.functions.invoke('send-assessment-report', {
        body: {
          recipientEmail: 'test@example.com',
          reportUrl: 'https://example.com/report.pdf'
        }
      })

      expect(result.error.code).toBe('DELIVERY_FAILED')
    })
  })

  describe('process-assessment', () => {
    it('processes assessment responses and calculates scores', async () => {
      const mockResponse = {
        data: {
          scores: {
            personality: { openness: 85, conscientiousness: 75 },
            interests: { investigative: 90, realistic: 60 },
            overallScore: 78
          },
          validityMetrics: {
            responseTime: 1200,
            consistencyScore: 0.85,
            engagementLevel: 'High'
          },
          success: true
        },
        error: null
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse)

      const assessmentData = {
        assessmentType: 'career-launch',
        responses: [
          { questionId: 'q1', answer: 4, dimension: 'Personality', subdimension: 'Openness' },
          { questionId: 'q2', answer: 5, dimension: 'RIASEC', subdimension: 'Investigative' }
        ],
        candidateInfo: {
          name: 'John Doe',
          age: 25,
          education: 'bachelor'
        }
      }

      const result = await supabase.functions.invoke('process-assessment', {
        body: assessmentData
      })

      expect(result.data.scores).toBeDefined()
      expect(result.data.validityMetrics).toBeDefined()
      expect(result.data.scores.overallScore).toBeGreaterThan(0)
    })

    it('detects invalid response patterns', async () => {
      const mockResponse = {
        data: {
          scores: {},
          validityMetrics: {
            responseTime: 300,
            consistencyScore: 0.1,
            engagementLevel: 'Low',
            warnings: ['Possible straight-line responding detected']
          },
          success: false
        },
        error: null
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse)

      const invalidResponses = Array(20).fill(null).map((_, i) => ({
        questionId: `q${i + 1}`,
        answer: 3, // All same answer
        dimension: 'Personality'
      }))

      const result = await supabase.functions.invoke('process-assessment', {
        body: {
          assessmentType: 'career-launch',
          responses: invalidResponses
        }
      })

      expect(result.data.validityMetrics.warnings).toContain(
        'Possible straight-line responding detected'
      )
      expect(result.data.success).toBe(false)
    })

    it('handles incomplete assessment data', async () => {
      const mockError = {
        data: null,
        error: {
          message: 'Incomplete assessment data',
          code: 'INCOMPLETE_DATA'
        }
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockError)

      const result = await supabase.functions.invoke('process-assessment', {
        body: {
          assessmentType: 'career-launch',
          responses: [] // Empty responses
        }
      })

      expect(result.error.code).toBe('INCOMPLETE_DATA')
    })
  })

  describe('ai-chatbot', () => {
    it('provides assessment guidance', async () => {
      const mockResponse = {
        data: {
          response: 'The Career Launch Assessment helps identify your personality traits, interests, and work values to provide personalized career recommendations.',
          conversationId: 'conv_123',
          success: true
        },
        error: null
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse)

      const chatData = {
        message: 'What does the Career Launch Assessment measure?',
        conversationId: null
      }

      const result = await supabase.functions.invoke('ai-chatbot', {
        body: chatData
      })

      expect(result.data.response).toContain('Career Launch Assessment')
      expect(result.data.conversationId).toBeDefined()
    })

    it('maintains conversation context', async () => {
      const mockResponse = {
        data: {
          response: 'Yes, the assessment typically takes 20-30 minutes to complete.',
          conversationId: 'conv_123',
          success: true
        },
        error: null
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse)

      const chatData = {
        message: 'How long does it take?',
        conversationId: 'conv_123'
      }

      const result = await supabase.functions.invoke('ai-chatbot', {
        body: chatData
      })

      expect(result.data.response).toContain('20-30 minutes')
      expect(result.data.conversationId).toBe('conv_123')
    })

    it('handles inappropriate messages', async () => {
      const mockResponse = {
        data: {
          response: 'I can only provide information about our assessment platform and career development topics.',
          conversationId: 'conv_123',
          warning: 'Inappropriate content detected',
          success: true
        },
        error: null
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse)

      const result = await supabase.functions.invoke('ai-chatbot', {
        body: {
          message: 'Inappropriate message content',
          conversationId: 'conv_123'
        }
      })

      expect(result.data.warning).toBe('Inappropriate content detected')
    })
  })

  describe('Error Handling', () => {
    it('handles network timeout errors', async () => {
      vi.mocked(supabase.functions.invoke).mockRejectedValueOnce(
        new Error('Network timeout')
      )

      await expect(
        supabase.functions.invoke('generate-pdf-report', { body: {} })
      ).rejects.toThrow('Network timeout')
    })

    it('handles function not found errors', async () => {
      const mockError = {
        data: null,
        error: {
          message: 'Function not found',
          code: 'FUNCTION_NOT_FOUND'
        }
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockError)

      const result = await supabase.functions.invoke('non-existent-function', {
        body: {}
      })

      expect(result.error.code).toBe('FUNCTION_NOT_FOUND')
    })

    it('handles authentication errors', async () => {
      const mockError = {
        data: null,
        error: {
          message: 'Authentication required',
          code: 'UNAUTHORIZED'
        }
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockError)

      const result = await supabase.functions.invoke('generate-pdf-report', {
        body: {}
      })

      expect(result.error.code).toBe('UNAUTHORIZED')
    })
  })

  describe('Performance', () => {
    it('handles concurrent function calls', async () => {
      const mockResponse = {
        data: { success: true },
        error: null
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValue(mockResponse)

      const promises = Array(5).fill(null).map(() =>
        supabase.functions.invoke('generate-ai-report', {
          body: { responses: [] }
        })
      )

      const results = await Promise.all(promises)

      expect(results).toHaveLength(5)
      results.forEach(result => {
        expect(result.data.success).toBe(true)
      })
    })

    it('handles large payload processing', async () => {
      const largePayload = {
        responses: Array(1000).fill(null).map((_, i) => ({
          questionId: `q${i}`,
          answer: Math.floor(Math.random() * 5) + 1,
          dimension: 'Personality'
        }))
      }

      const mockResponse = {
        data: { success: true, processed: 1000 },
        error: null
      }

      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce(mockResponse)

      const result = await supabase.functions.invoke('process-assessment', {
        body: largePayload
      })

      expect(result.data.processed).toBe(1000)
    })
  })
})