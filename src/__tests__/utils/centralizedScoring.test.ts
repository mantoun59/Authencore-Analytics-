import { describe, it, expect } from 'vitest'
import { CentralizedScoringEngine } from '../../utils/centralizedScoring'

describe('CentralizedScoringEngine', () => {
  describe('normalizeScore', () => {
    it('normalizes scores to 0-100 range correctly', () => {
      expect(CentralizedScoringEngine.normalizeScore(1, 1, 5)).toBe(0)
      expect(CentralizedScoringEngine.normalizeScore(3, 1, 5)).toBe(50)
      expect(CentralizedScoringEngine.normalizeScore(5, 1, 5)).toBe(100)
    })

    it('handles edge cases', () => {
      expect(CentralizedScoringEngine.normalizeScore(0, 0, 0)).toBe(0)
      expect(CentralizedScoringEngine.normalizeScore(10, 0, 10)).toBe(100)
      expect(CentralizedScoringEngine.normalizeScore(-5, -10, 0)).toBe(50)
    })

    it('clamps values outside range', () => {
      expect(CentralizedScoringEngine.normalizeScore(-1, 1, 5)).toBe(0)
      expect(CentralizedScoringEngine.normalizeScore(6, 1, 5)).toBe(100)
    })
  })

  describe('calculateWeightedScore', () => {
    it('calculates weighted scores correctly', () => {
      const scores = [80, 90, 70]
      const weights = [0.5, 0.3, 0.2]
      
      const result = CentralizedScoringEngine.calculateWeightedScore(scores, weights)
      const expected = (80 * 0.5) + (90 * 0.3) + (70 * 0.2)
      
      expect(result).toBe(expected)
    })

    it('handles equal weights when not provided', () => {
      const scores = [60, 80, 100]
      
      const result = CentralizedScoringEngine.calculateWeightedScore(scores)
      const expected = (60 + 80 + 100) / 3
      
      expect(result).toBe(expected)
    })

    it('normalizes weights if they don\'t sum to 1', () => {
      const scores = [75, 85]
      const weights = [2, 3] // Sum is 5, not 1
      
      const result = CentralizedScoringEngine.calculateWeightedScore(scores, weights)
      const expected = (75 * 0.4) + (85 * 0.6) // Normalized to 0.4 and 0.6
      
      expect(result).toBe(expected)
    })

    it('handles empty arrays', () => {
      expect(CentralizedScoringEngine.calculateWeightedScore([])).toBe(0)
      expect(CentralizedScoringEngine.calculateWeightedScore([], [])).toBe(0)
    })
  })

  describe('getPercentileRank', () => {
    it('calculates percentile rank correctly', () => {
      const score = 85
      const normData = [60, 65, 70, 75, 80, 85, 90, 95]
      
      const percentile = CentralizedScoringEngine.getPercentileRank(score, normData)
      
      expect(percentile).toBeGreaterThanOrEqual(0)
      expect(percentile).toBeLessThanOrEqual(100)
    })

    it('handles score at extremes', () => {
      const normData = [60, 70, 80, 90]
      
      expect(CentralizedScoringEngine.getPercentileRank(50, normData)).toBe(0)
      expect(CentralizedScoringEngine.getPercentileRank(100, normData)).toBe(100)
    })

    it('handles duplicate scores', () => {
      const normData = [70, 70, 70, 80, 80, 90]
      
      const percentile = CentralizedScoringEngine.getPercentileRank(70, normData)
      expect(percentile).toBeGreaterThan(0)
      expect(percentile).toBeLessThan(100)
    })

    it('returns 50th percentile for median score', () => {
      const normData = [60, 70, 80, 90, 100]
      
      const percentile = CentralizedScoringEngine.getPercentileRank(80, normData)
      expect(percentile).toBeCloseTo(50, 0)
    })
  })

  describe('calculateZScore', () => {
    it('calculates z-score correctly', () => {
      const score = 85
      const mean = 75
      const stdDev = 10
      
      const zScore = CentralizedScoringEngine.calculateZScore(score, mean, stdDev)
      expect(zScore).toBe(1) // (85-75)/10 = 1
    })

    it('handles negative z-scores', () => {
      const score = 65
      const mean = 75
      const stdDev = 10
      
      const zScore = CentralizedScoringEngine.calculateZScore(score, mean, stdDev)
      expect(zScore).toBe(-1)
    })

    it('handles zero standard deviation', () => {
      const score = 75
      const mean = 75
      const stdDev = 0
      
      const zScore = CentralizedScoringEngine.calculateZScore(score, mean, stdDev)
      expect(zScore).toBe(0)
    })
  })

  describe('calculateReliabilityCoefficient', () => {
    it('calculates reliability coefficient', () => {
      const responses1 = [1, 2, 3, 4, 5]
      const responses2 = [1, 2, 3, 4, 5]
      
      const reliability = CentralizedScoringEngine.calculateReliabilityCoefficient(responses1, responses2)
      expect(reliability).toBe(1) // Perfect correlation
    })

    it('handles inversely correlated responses', () => {
      const responses1 = [1, 2, 3, 4, 5]
      const responses2 = [5, 4, 3, 2, 1]
      
      const reliability = CentralizedScoringEngine.calculateReliabilityCoefficient(responses1, responses2)
      expect(reliability).toBe(-1) // Perfect inverse correlation
    })

    it('handles uncorrelated responses', () => {
      const responses1 = [1, 2, 3, 4, 5]
      const responses2 = [3, 3, 3, 3, 3]
      
      const reliability = CentralizedScoringEngine.calculateReliabilityCoefficient(responses1, responses2)
      expect(reliability).toBe(0) // No correlation
    })

    it('handles mismatched array lengths', () => {
      const responses1 = [1, 2, 3]
      const responses2 = [1, 2, 3, 4, 5]
      
      const reliability = CentralizedScoringEngine.calculateReliabilityCoefficient(responses1, responses2)
      expect(reliability).toBeNaN()
    })
  })

  describe('validateResponsePattern', () => {
    it('detects straight-line responding', () => {
      const straightLineResponses = [3, 3, 3, 3, 3, 3, 3, 3]
      
      const validation = CentralizedScoringEngine.validateResponsePattern(straightLineResponses)
      expect(validation.isStraightLining).toBe(true)
      expect(validation.isValid).toBe(false)
    })

    it('detects random responding', () => {
      const randomResponses = [1, 5, 2, 4, 1, 5, 2, 4, 1, 5]
      
      const validation = CentralizedScoringEngine.validateResponsePattern(randomResponses)
      expect(validation.isRandomResponding).toBe(true)
      expect(validation.isValid).toBe(false)
    })

    it('validates normal response patterns', () => {
      const normalResponses = [2, 3, 4, 3, 2, 4, 3, 2, 4, 3]
      
      const validation = CentralizedScoringEngine.validateResponsePattern(normalResponses)
      expect(validation.isValid).toBe(true)
      expect(validation.isStraightLining).toBe(false)
      expect(validation.isRandomResponding).toBe(false)
    })

    it('calculates response consistency', () => {
      const responses = [2, 3, 2, 3, 2, 3, 2, 3]
      
      const validation = CentralizedScoringEngine.validateResponsePattern(responses)
      expect(validation.consistencyScore).toBeGreaterThan(0)
      expect(validation.consistencyScore).toBeLessThanOrEqual(1)
    })
  })

  describe('adjustForDemographics', () => {
    it('applies demographic adjustments', () => {
      const baseScore = 75
      const demographics = {
        age: 25,
        education: 'bachelor',
        experience: 3
      }
      const adjustmentFactors = {
        age: { 25: 1.1 },
        education: { bachelor: 0.95 },
        experience: { 3: 1.05 }
      }
      
      const adjustedScore = CentralizedScoringEngine.adjustForDemographics(
        baseScore, 
        demographics, 
        adjustmentFactors
      )
      
      expect(adjustedScore).not.toBe(baseScore)
      expect(adjustedScore).toBeGreaterThan(0)
    })

    it('handles missing demographic data', () => {
      const baseScore = 75
      const demographics = {}
      const adjustmentFactors = {}
      
      const adjustedScore = CentralizedScoringEngine.adjustForDemographics(
        baseScore, 
        demographics, 
        adjustmentFactors
      )
      
      expect(adjustedScore).toBe(baseScore)
    })

    it('clamps adjusted scores to valid range', () => {
      const baseScore = 95
      const demographics = { factor: 'high' }
      const adjustmentFactors = { factor: { high: 2.0 } }
      
      const adjustedScore = CentralizedScoringEngine.adjustForDemographics(
        baseScore, 
        demographics, 
        adjustmentFactors
      )
      
      expect(adjustedScore).toBeLessThanOrEqual(100)
    })
  })

  describe('generateConfidenceInterval', () => {
    it('generates confidence interval', () => {
      const score = 75
      const standardError = 5
      const confidenceLevel = 0.95
      
      const interval = CentralizedScoringEngine.generateConfidenceInterval(
        score, 
        standardError, 
        confidenceLevel
      )
      
      expect(interval.lower).toBeLessThan(score)
      expect(interval.upper).toBeGreaterThan(score)
      expect(interval.lower).toBeGreaterThanOrEqual(0)
      expect(interval.upper).toBeLessThanOrEqual(100)
    })

    it('handles different confidence levels', () => {
      const score = 75
      const standardError = 5
      
      const interval90 = CentralizedScoringEngine.generateConfidenceInterval(score, standardError, 0.90)
      const interval99 = CentralizedScoringEngine.generateConfidenceInterval(score, standardError, 0.99)
      
      expect(interval99.upper - interval99.lower).toBeGreaterThan(interval90.upper - interval90.lower)
    })

    it('handles zero standard error', () => {
      const score = 75
      const standardError = 0
      
      const interval = CentralizedScoringEngine.generateConfidenceInterval(score, standardError, 0.95)
      
      expect(interval.lower).toBe(score)
      expect(interval.upper).toBe(score)
    })
  })
})