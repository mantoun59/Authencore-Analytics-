import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCommunicationStylesScoring } from '../../hooks/useCommunicationStylesScoring'

describe('useCommunicationStylesScoring', () => {
  let hook: ReturnType<typeof useCommunicationStylesScoring>

  beforeEach(() => {
    const { result } = renderHook(() => useCommunicationStylesScoring())
    hook = result.current
  })

  describe('calculateScores', () => {
    it('calculates assertiveness scores correctly', () => {
      const mockAnswers = {
        q1: 'strongly_agree',
        q2: 'agree',
        q3: 'neutral',
        q4: 'disagree',
        q5: 'strongly_disagree'
      }

      const scores = hook.calculateScores(mockAnswers)

      expect(scores).toBeDefined()
      expect(scores.assertiveness).toBeDefined()
      expect(typeof scores.assertiveness).toBe('number')
      expect(scores.assertiveness).toBeGreaterThanOrEqual(0)
      expect(scores.assertiveness).toBeLessThanOrEqual(100)
    })

    it('calculates expressiveness scores correctly', () => {
      const mockAnswers = {
        q6: 'always',
        q7: 'often',
        q8: 'sometimes',
        q9: 'rarely',
        q10: 'never'
      }

      const scores = hook.calculateScores(mockAnswers)

      expect(scores.expressiveness).toBeDefined()
      expect(typeof scores.expressiveness).toBe('number')
      expect(scores.expressiveness).toBeGreaterThanOrEqual(0)
      expect(scores.expressiveness).toBeLessThanOrEqual(100)
    })

    it('calculates listening scores correctly', () => {
      const mockAnswers = {
        q11: 'excellent',
        q12: 'good',
        q13: 'average',
        q14: 'below_average',
        q15: 'poor'
      }

      const scores = hook.calculateScores(mockAnswers)

      expect(scores.listening).toBeDefined()
      expect(typeof scores.listening).toBe('number')
      expect(scores.listening).toBeGreaterThanOrEqual(0)
      expect(scores.listening).toBeLessThanOrEqual(100)
    })

    it('handles empty answers gracefully', () => {
      const scores = hook.calculateScores({})

      expect(scores).toBeDefined()
      expect(scores.assertiveness).toBeDefined()
      expect(scores.expressiveness).toBeDefined()
      expect(scores.listening).toBeDefined()
      expect(scores.adaptability).toBeDefined()
    })

    it('normalizes all scores to 0-100 range', () => {
      const mockAnswers = {
        q1: 'strongly_agree',
        q2: 'strongly_agree',
        q3: 'strongly_agree',
        q4: 'strongly_agree',
        q5: 'strongly_agree'
      }

      const scores = hook.calculateScores(mockAnswers)

      Object.values(scores).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(100)
      })
    })
  })

  describe('getMainStyle', () => {
    it('identifies Assertive style correctly', () => {
      const scores = {
        assertiveness: 90,
        expressiveness: 60,
        listening: 70,
        adaptability: 65
      }

      const style = hook.getMainStyle(scores)
      expect(style).toBe('Assertive')
    })

    it('identifies Expressive style correctly', () => {
      const scores = {
        assertiveness: 60,
        expressiveness: 90,
        listening: 70,
        adaptability: 65
      }

      const style = hook.getMainStyle(scores)
      expect(style).toBe('Expressive')
    })

    it('identifies Analytical style correctly', () => {
      const scores = {
        assertiveness: 60,
        expressiveness: 40,
        listening: 90,
        adaptability: 85
      }

      const style = hook.getMainStyle(scores)
      expect(style).toBe('Analytical')
    })

    it('identifies Amiable style correctly', () => {
      const scores = {
        assertiveness: 40,
        expressiveness: 40,
        listening: 85,
        adaptability: 90
      }

      const style = hook.getMainStyle(scores)
      expect(style).toBe('Amiable')
    })

    it('handles balanced scores', () => {
      const scores = {
        assertiveness: 70,
        expressiveness: 70,
        listening: 70,
        adaptability: 70
      }

      const style = hook.getMainStyle(scores)
      expect(['Assertive', 'Expressive', 'Analytical', 'Amiable']).toContain(style)
    })
  })

  describe('getStyleDescription', () => {
    it('provides descriptions for all communication styles', () => {
      const styles = ['Assertive', 'Expressive', 'Analytical', 'Amiable']

      styles.forEach(style => {
        const description = hook.getStyleDescription(style)
        expect(description).toBeDefined()
        expect(typeof description).toBe('string')
        expect(description.length).toBeGreaterThan(0)
      })
    })

    it('returns default description for unknown style', () => {
      const description = hook.getStyleDescription('Unknown')
      expect(description).toBeDefined()
      expect(typeof description).toBe('string')
    })
  })

  describe('getCommunicationStyle', () => {
    it('returns complete communication style profile', () => {
      const scores = {
        assertiveness: 85,
        expressiveness: 70,
        listening: 75,
        adaptability: 60
      }

      const style = hook.getCommunicationStyle(scores)

      expect(style).toBeDefined()
      expect(style.primary).toBeDefined()
      expect(style.secondary).toBeDefined()
      expect(style.description).toBeDefined()
      expect(style.strengths).toBeDefined()
      expect(style.developmentAreas).toBeDefined()

      expect(Array.isArray(style.strengths)).toBe(true)
      expect(Array.isArray(style.developmentAreas)).toBe(true)
      expect(style.strengths.length).toBeGreaterThan(0)
      expect(style.developmentAreas.length).toBeGreaterThan(0)
    })

    it('identifies secondary style correctly', () => {
      const scores = {
        assertiveness: 85,
        expressiveness: 80,
        listening: 60,
        adaptability: 55
      }

      const style = hook.getCommunicationStyle(scores)

      expect(style.primary).toBe('Assertive')
      expect(style.secondary).toBe('Expressive')
    })

    it('provides relevant strengths and development areas', () => {
      const scores = {
        assertiveness: 90,
        expressiveness: 50,
        listening: 70,
        adaptability: 60
      }

      const style = hook.getCommunicationStyle(scores)

      expect(style.strengths).toContain(expect.stringMatching(/confident|direct|decisive|leadership/i))
      expect(style.developmentAreas.length).toBeGreaterThan(0)
    })
  })
})