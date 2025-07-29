import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCareerLaunchScoring } from '../../hooks/useCareerLaunchScoring'

describe('useCareerLaunchScoring', () => {
  let hook: ReturnType<typeof useCareerLaunchScoring>

  beforeEach(() => {
    const { result } = renderHook(() => useCareerLaunchScoring())
    hook = result.current
  })

  describe('calculateScores', () => {
    it('calculates basic personality scores correctly', () => {
      const mockResponses = [
        { dimension: 'Personality', subdimension: 'Openness', value: 4 },
        { dimension: 'Personality', subdimension: 'Conscientiousness', value: 5 },
        { dimension: 'Personality', subdimension: 'Extraversion', value: 3 },
        { dimension: 'Personality', subdimension: 'Agreeableness', value: 4 },
        { dimension: 'Personality', subdimension: 'Neuroticism', value: 2 }
      ]

      const scores = hook.calculateScores(mockResponses)

      expect(scores).toBeDefined()
      expect(scores.personality).toBeDefined()
      expect(scores.personality.openness).toBeGreaterThan(0)
      expect(scores.personality.conscientiousness).toBeGreaterThan(0)
      expect(scores.personality.extraversion).toBeGreaterThan(0)
      expect(scores.personality.agreeableness).toBeGreaterThan(0)
      expect(scores.personality.neuroticism).toBeGreaterThan(0)
    })

    it('calculates RIASEC interest scores correctly', () => {
      const mockResponses = [
        { dimension: 'RIASEC', subdimension: 'Realistic', value: 5 },
        { dimension: 'RIASEC', subdimension: 'Investigative', value: 4 },
        { dimension: 'RIASEC', subdimension: 'Artistic', value: 3 },
        { dimension: 'RIASEC', subdimension: 'Social', value: 4 },
        { dimension: 'RIASEC', subdimension: 'Enterprising', value: 5 },
        { dimension: 'RIASEC', subdimension: 'Conventional', value: 3 }
      ]

      const scores = hook.calculateScores(mockResponses)

      expect(scores.interests).toBeDefined()
      expect(scores.interests.realistic).toBeGreaterThan(0)
      expect(scores.interests.investigative).toBeGreaterThan(0)
      expect(scores.interests.artistic).toBeGreaterThan(0)
      expect(scores.interests.social).toBeGreaterThan(0)
      expect(scores.interests.enterprising).toBeGreaterThan(0)
      expect(scores.interests.conventional).toBeGreaterThan(0)
    })

    it('calculates work values correctly', () => {
      const mockResponses = [
        { dimension: 'Values', subdimension: 'Achievement', value: 5 },
        { dimension: 'Values', subdimension: 'Independence', value: 4 },
        { dimension: 'Values', subdimension: 'Recognition', value: 3 },
        { dimension: 'Values', subdimension: 'Relationships', value: 4 },
        { dimension: 'Values', subdimension: 'Support', value: 3 },
        { dimension: 'Values', subdimension: 'Working_Conditions', value: 4 }
      ]

      const scores = hook.calculateScores(mockResponses)

      expect(scores.values).toBeDefined()
      expect(scores.values.achievement).toBeGreaterThan(0)
      expect(scores.values.independence).toBeGreaterThan(0)
      expect(scores.values.recognition).toBeGreaterThan(0)
      expect(scores.values.relationships).toBeGreaterThan(0)
      expect(scores.values.support).toBeGreaterThan(0)
      expect(scores.values.working_conditions).toBeGreaterThan(0)
    })

    it('handles empty responses gracefully', () => {
      const scores = hook.calculateScores([])
      
      expect(scores).toBeDefined()
      expect(scores.personality).toBeDefined()
      expect(scores.interests).toBeDefined()
      expect(scores.values).toBeDefined()
      expect(scores.aptitude).toBeDefined()
    })

    it('normalizes scores to 0-100 range', () => {
      const mockResponses = [
        { dimension: 'Personality', subdimension: 'Openness', value: 5 },
        { dimension: 'RIASEC', subdimension: 'Realistic', value: 1 }
      ]

      const scores = hook.calculateScores(mockResponses)

      // All scores should be between 0 and 100
      Object.values(scores.personality).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(100)
      })

      Object.values(scores.interests).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(100)
      })
    })
  })

  describe('generateCareerRecommendations', () => {
    it('generates appropriate career recommendations', () => {
      const mockScores = {
        personality: { openness: 85, conscientiousness: 90, extraversion: 70, agreeableness: 75, neuroticism: 30 },
        interests: { realistic: 40, investigative: 90, artistic: 60, social: 70, enterprising: 80, conventional: 50 },
        values: { achievement: 95, independence: 85, recognition: 70, relationships: 60, support: 55, working_conditions: 65 },
        aptitude: { verbal: 85, numerical: 90, abstract: 95, mechanical: 60, spatial: 70, perceptual: 75 }
      }

      const recommendations = hook.generateCareerRecommendations(mockScores)

      expect(recommendations).toBeDefined()
      expect(Array.isArray(recommendations)).toBe(true)
      expect(recommendations.length).toBeGreaterThan(0)
      expect(recommendations.length).toBeLessThanOrEqual(10)

      recommendations.forEach(career => {
        expect(career).toHaveProperty('title')
        expect(career).toHaveProperty('match_percentage')
        expect(career).toHaveProperty('description')
        expect(career).toHaveProperty('growth_outlook')
        expect(typeof career.title).toBe('string')
        expect(typeof career.match_percentage).toBe('number')
        expect(career.match_percentage).toBeGreaterThan(0)
        expect(career.match_percentage).toBeLessThanOrEqual(100)
      })
    })

    it('returns careers sorted by match percentage', () => {
      const mockScores = {
        personality: { openness: 80, conscientiousness: 85, extraversion: 75, agreeableness: 70, neuroticism: 35 },
        interests: { realistic: 50, investigative: 85, artistic: 65, social: 75, enterprising: 80, conventional: 55 },
        values: { achievement: 90, independence: 80, recognition: 75, relationships: 65, support: 60, working_conditions: 70 },
        aptitude: { verbal: 80, numerical: 85, abstract: 90, mechanical: 65, spatial: 75, perceptual: 80 }
      }

      const recommendations = hook.generateCareerRecommendations(mockScores)

      for (let i = 0; i < recommendations.length - 1; i++) {
        expect(recommendations[i].match_percentage).toBeGreaterThanOrEqual(
          recommendations[i + 1].match_percentage
        )
      }
    })
  })

  describe('calculateOverallReadiness', () => {
    it('calculates overall career readiness score', () => {
      const mockScores = {
        personality: { openness: 80, conscientiousness: 85, extraversion: 75, agreeableness: 70, neuroticism: 35 },
        interests: { realistic: 50, investigative: 85, artistic: 65, social: 75, enterprising: 80, conventional: 55 },
        values: { achievement: 90, independence: 80, recognition: 75, relationships: 65, support: 60, working_conditions: 70 },
        aptitude: { verbal: 80, numerical: 85, abstract: 90, mechanical: 65, spatial: 75, perceptual: 80 }
      }

      const readiness = hook.calculateOverallReadiness(mockScores)

      expect(readiness).toBeDefined()
      expect(typeof readiness).toBe('number')
      expect(readiness).toBeGreaterThanOrEqual(0)
      expect(readiness).toBeLessThanOrEqual(100)
    })

    it('returns higher scores for well-rounded profiles', () => {
      const balancedScores = {
        personality: { openness: 75, conscientiousness: 80, extraversion: 75, agreeableness: 75, neuroticism: 40 },
        interests: { realistic: 70, investigative: 75, artistic: 70, social: 75, enterprising: 75, conventional: 70 },
        values: { achievement: 80, independence: 75, recognition: 70, relationships: 75, support: 70, working_conditions: 75 },
        aptitude: { verbal: 80, numerical: 80, abstract: 80, mechanical: 75, spatial: 75, perceptual: 80 }
      }

      const extremeScores = {
        personality: { openness: 100, conscientiousness: 100, extraversion: 20, agreeableness: 20, neuroticism: 80 },
        interests: { realistic: 100, investigative: 100, artistic: 0, social: 0, enterprising: 0, conventional: 0 },
        values: { achievement: 100, independence: 100, recognition: 0, relationships: 0, support: 0, working_conditions: 0 },
        aptitude: { verbal: 100, numerical: 100, abstract: 0, mechanical: 0, spatial: 0, perceptual: 0 }
      }

      const balancedReadiness = hook.calculateOverallReadiness(balancedScores)
      const extremeReadiness = hook.calculateOverallReadiness(extremeScores)

      expect(balancedReadiness).toBeGreaterThan(extremeReadiness)
    })
  })
})