# Career Launch Assessment Scoring Documentation

## Overview
The Career Launch Assessment combines four major psychometric domains to provide comprehensive career orientation insights:

1. **RIASEC (Interests)** - Based on Holland's Career Interest Theory
2. **Aptitudes** - Cognitive and practical skill assessments
3. **Personality** - Work-relevant trait dimensions
4. **Values** - Core work values and motivations

## Scoring Methodology

### 1. Raw Score Calculation

Each question presents two options (A/B) with scoring weights:
```typescript
interface CareerLaunchQuestion {
  id: string;
  category: 'RIASEC' | 'Aptitude' | 'Personality' | 'Values';
  dimension: string;
  optionA: string;
  optionB: string;
  scoringWeight: number;
  isReversed: boolean;
}
```

**Raw Score Formula:**
- Option A selected: `score = 1 * scoringWeight`
- Option B selected: `score = 2 * scoringWeight`
- If `isReversed = true`: `score = (3 - originalScore) * scoringWeight`

### 2. Dimension Scoring

Responses are grouped by dimension and averaged:
```
Dimension Score = Σ(weighted responses) / number of responses
```

**Normalization:** All scores are scaled to 0-100 range for consistency.

### 3. Career Readiness Dimensions

| Dimension | Description | Key Components |
|-----------|-------------|----------------|
| **skill_readiness** | Technical and cognitive abilities | Aptitude scores, problem-solving |
| **communication_skills** | Interpersonal effectiveness | Social dimensions, verbal aptitude |
| **work_values_alignment** | Motivation and purpose fit | Values domain responses |
| **personality_fit** | Behavioral work style | Personality trait alignment |
| **interest_clarity** | Career direction certainty | RIASEC coherence and strength |
| **adaptability** | Change and learning orientation | Openness, flexibility traits |

### 4. Percentile Calculation

Scores are compared against normative database:
```typescript
const percentileNorms = {
  skill_readiness: [15, 25, 35, 50, 65, 75, 85, 95],
  communication_skills: [20, 30, 40, 55, 70, 80, 90, 97],
  // ... other dimensions
};
```

**Percentile Formula:**
```
Percentile = (Number of norm scores ≤ candidate score / Total norm scores) × 100
```

### 5. Readiness Level Assignment

| Score Range | Readiness Level | Description |
|-------------|----------------|-------------|
| 0-39 | **Emerging** | Early career development stage |
| 40-59 | **Developing** | Building foundational skills |
| 60-79 | **Proficient** | Work-ready with growth areas |
| 80-100 | **Advanced** | Highly prepared for career launch |

### 6. Quality Metrics & Validity

#### Response Quality Indicators:
- **Completion Rate:** Percentage of questions answered
- **Response Time:** Time per question (flags <5s or >120s)
- **Consistency:** Agreement between similar questions
- **Straight-Lining:** Detection of identical response patterns

#### Validity Flags:
```typescript
interface ValidityMetrics {
  isValid: boolean;
  warnings: string[];
  qualityScore: number; // 0-100
  responseTime: number;
  consistency: number;
  completionRate: number;
}
```

**Quality Score Calculation:**
```
Quality Score = (completion × 0.3) + (consistency × 0.4) + (timeValidity × 0.3)
```

Where:
- `completion = completionRate / 100`
- `consistency = 1 - (inconsistent responses / total paired responses)`
- `timeValidity = 1 if avgTime between 10-60s, else penalty applied`

### 7. Career Recommendations Algorithm

#### Interest-Aptitude Matching:
1. Identify top 2 RIASEC codes
2. Cross-reference with aptitude strengths
3. Generate career suggestions based on O*NET database alignment

#### Values Integration:
- Filter career suggestions by values compatibility
- Prioritize careers matching top 3 work values

#### Development Area Identification:
```typescript
const developmentAreas = dimensions
  .filter(d => d.percentile < 40)
  .sort((a, b) => a.percentile - b.percentile)
  .slice(0, 3);
```

### 8. Report Generation Logic

#### Insights Structure:
```typescript
interface CareerInsights {
  careerFitProfile: string;        // Narrative assessment
  workplaceReadiness: string;      // Current preparation level
  nextSteps: string[];            // Actionable recommendations
  compatibilityFlags: string[];   // Potential challenges
}
```

#### Profile Generation:
1. **Career Fit Profile:** Based on RIASEC + Aptitude alignment
2. **Workplace Readiness:** Personality + Values + Communication
3. **Next Steps:** Targeted development based on lowest percentiles
4. **Compatibility Flags:** Misalignment warnings (e.g., high Realistic + low Spatial)

### 9. Reliability & Validation

#### Internal Consistency (Estimated):
- **RIASEC dimensions:** α ≈ 0.75-0.85
- **Aptitude scales:** α ≈ 0.80-0.90
- **Personality factors:** α ≈ 0.70-0.85
- **Values domains:** α ≈ 0.75-0.80

#### Construct Validity:
- Correlations with established instruments (Strong Interest Inventory, O*NET Interest Profiler)
- Predictive validity through follow-up career satisfaction studies

### 10. Demographic Adjustments

Optional adjustments based on candidate profile:
```typescript
interface DemographicAdjustments {
  age_adjustment: number;     // ±2 points for age <20 or >30
  education_boost: number;    // +3 points for advanced education
  experience_factor: number;  // +1 point per year relevant experience
}
```

### 11. Implementation Notes

#### Performance Optimizations:
- Scoring engine uses singleton pattern for consistent calculation
- Percentile lookups use binary search for O(log n) performance
- Results cached to prevent recalculation

#### Error Handling:
- Missing responses default to neutral scores
- Invalid responses trigger quality warnings
- Partial completions still generate results with quality flags

### 12. Future Enhancements

#### Planned Improvements:
1. **Adaptive Scoring:** Dynamic question weighting based on response patterns
2. **Normative Updates:** Regular recalibration with expanded sample
3. **Machine Learning:** AI-enhanced career matching algorithms
4. **Longitudinal Tracking:** Career outcome prediction models

---

*This documentation reflects the current implementation as of the latest version. For technical implementation details, refer to the CareerLaunchScoringEngine class and associated TypeScript interfaces.*
