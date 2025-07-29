import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reportGenerator } from '../../services/reportGenerator'

// Mock Supabase client
vi.mock('../../integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    }
  }
}))

describe('Report Generator Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateAssessmentReport', () => {
    it('generates a complete assessment report', async () => {
      const mockAssessmentData = {
        type: 'career-launch',
        responses: [
          { question: 'Test question', answer: 'Test answer', dimension: 'Personality' }
        ],
        scores: {
          personality: { openness: 75, conscientiousness: 85 },
          interests: { realistic: 60, investigative: 80 },
          values: { achievement: 90, security: 70 }
        },
        candidateInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          position: 'Software Developer'
        }
      }

      const report = await reportGenerator.generateAssessmentReport(mockAssessmentData)

      expect(report).toBeDefined()
      expect(report).toHaveProperty('summary')
      expect(report).toHaveProperty('personalityAnalysis')
      expect(report).toHaveProperty('careerRecommendations')
      expect(report).toHaveProperty('developmentAreas')
      expect(report).toHaveProperty('actionPlan')
    })

    it('handles missing scores gracefully', async () => {
      const mockAssessmentData = {
        type: 'career-launch',
        responses: [],
        scores: {},
        candidateInfo: {
          name: 'Jane Doe',
          email: 'jane@example.com'
        }
      }

      const report = await reportGenerator.generateAssessmentReport(mockAssessmentData)

      expect(report).toBeDefined()
      expect(report.summary).toContain('assessment completed')
    })

    it('generates appropriate content for different assessment types', async () => {
      const careerLaunchData = {
        type: 'career-launch',
        responses: [],
        scores: { personality: { openness: 80 } },
        candidateInfo: { name: 'Test User' }
      }

      const communicationData = {
        type: 'communication-styles',
        responses: [],
        scores: { assertiveness: 75, expressiveness: 85 },
        candidateInfo: { name: 'Test User' }
      }

      const careerReport = await reportGenerator.generateAssessmentReport(careerLaunchData)
      const commReport = await reportGenerator.generateAssessmentReport(communicationData)

      expect(careerReport.careerRecommendations).toBeDefined()
      expect(commReport.summary).toContain('communication')
    })
  })

  describe('generatePersonalityAnalysis', () => {
    it('analyzes personality scores correctly', () => {
      const personalityScores = {
        openness: 85,
        conscientiousness: 75,
        extraversion: 60,
        agreeableness: 90,
        neuroticism: 25
      }

      const analysis = reportGenerator.generatePersonalityAnalysis(personalityScores)

      expect(analysis).toBeDefined()
      expect(typeof analysis).toBe('string')
      expect(analysis.length).toBeGreaterThan(50)
      expect(analysis).toMatch(/openness|conscientious|extraversion|agreeable|neuroticism/i)
    })

    it('handles extreme scores appropriately', () => {
      const extremeScores = {
        openness: 100,
        conscientiousness: 0,
        extraversion: 100,
        agreeableness: 0,
        neuroticism: 100
      }

      const analysis = reportGenerator.generatePersonalityAnalysis(extremeScores)

      expect(analysis).toBeDefined()
      expect(analysis).toMatch(/very high|extremely low|significant/i)
    })

    it('provides balanced analysis for moderate scores', () => {
      const moderateScores = {
        openness: 50,
        conscientiousness: 55,
        extraversion: 45,
        agreeableness: 60,
        neuroticism: 40
      }

      const analysis = reportGenerator.generatePersonalityAnalysis(moderateScores)

      expect(analysis).toBeDefined()
      expect(analysis).toMatch(/moderate|balanced|average/i)
    })
  })

  describe('generateCareerRecommendations', () => {
    it('provides relevant career suggestions', () => {
      const mockScores = {
        interests: { investigative: 90, realistic: 30, artistic: 70 },
        personality: { openness: 85, conscientiousness: 80 },
        values: { achievement: 95, independence: 85 }
      }

      const recommendations = reportGenerator.generateCareerRecommendations(mockScores)

      expect(recommendations).toBeDefined()
      expect(Array.isArray(recommendations)).toBe(true)
      expect(recommendations.length).toBeGreaterThan(0)

      recommendations.forEach(career => {
        expect(career).toHaveProperty('title')
        expect(career).toHaveProperty('match_percentage')
        expect(career).toHaveProperty('description')
        expect(typeof career.title).toBe('string')
        expect(typeof career.match_percentage).toBe('number')
      })
    })

    it('ranks careers by match percentage', () => {
      const mockScores = {
        interests: { investigative: 85, social: 75, enterprising: 65 },
        personality: { openness: 80, extraversion: 70 },
        values: { achievement: 90, relationships: 80 }
      }

      const recommendations = reportGenerator.generateCareerRecommendations(mockScores)

      for (let i = 0; i < recommendations.length - 1; i++) {
        expect(recommendations[i].match_percentage).toBeGreaterThanOrEqual(
          recommendations[i + 1].match_percentage
        )
      }
    })
  })

  describe('generateDevelopmentAreas', () => {
    it('identifies areas for improvement', () => {
      const mockScores = {
        personality: { openness: 30, conscientiousness: 40, extraversion: 25 },
        skills: { communication: 35, leadership: 30, problem_solving: 45 }
      }

      const developmentAreas = reportGenerator.generateDevelopmentAreas(mockScores)

      expect(developmentAreas).toBeDefined()
      expect(Array.isArray(developmentAreas)).toBe(true)
      expect(developmentAreas.length).toBeGreaterThan(0)

      developmentAreas.forEach(area => {
        expect(area).toHaveProperty('area')
        expect(area).toHaveProperty('priority')
        expect(area).toHaveProperty('recommendations')
        expect(['High', 'Medium', 'Low']).toContain(area.priority)
      })
    })

    it('prioritizes development areas correctly', () => {
      const mockScores = {
        personality: { openness: 20, conscientiousness: 80, extraversion: 50 },
        skills: { communication: 25, leadership: 75, problem_solving: 85 }
      }

      const developmentAreas = reportGenerator.generateDevelopmentAreas(mockScores)
      
      const highPriorityAreas = developmentAreas.filter(area => area.priority === 'High')
      expect(highPriorityAreas.length).toBeGreaterThan(0)
    })
  })

  describe('generateActionPlan', () => {
    it('creates structured action plan', () => {
      const mockData = {
        scores: {
          personality: { openness: 60, conscientiousness: 70 },
          interests: { investigative: 80, social: 65 }
        },
        developmentAreas: [
          { area: 'Communication Skills', priority: 'High' },
          { area: 'Leadership', priority: 'Medium' }
        ]
      }

      const actionPlan = reportGenerator.generateActionPlan(mockData)

      expect(actionPlan).toBeDefined()
      expect(actionPlan).toHaveProperty('shortTerm')
      expect(actionPlan).toHaveProperty('mediumTerm')
      expect(actionPlan).toHaveProperty('longTerm')

      expect(Array.isArray(actionPlan.shortTerm)).toBe(true)
      expect(Array.isArray(actionPlan.mediumTerm)).toBe(true)
      expect(Array.isArray(actionPlan.longTerm)).toBe(true)
    })

    it('includes specific actionable items', () => {
      const mockData = {
        scores: { personality: { conscientiousness: 45 } },
        developmentAreas: [{ area: 'Time Management', priority: 'High' }]
      }

      const actionPlan = reportGenerator.generateActionPlan(mockData)

      const allActions = [
        ...actionPlan.shortTerm,
        ...actionPlan.mediumTerm,
        ...actionPlan.longTerm
      ]

      expect(allActions.length).toBeGreaterThan(0)
      allActions.forEach(action => {
        expect(typeof action).toBe('string')
        expect(action.length).toBeGreaterThan(10)
      })
    })
  })
})