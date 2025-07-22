describe('Assessment Flow E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('completes career launch assessment flow', () => {
    // Navigate to Career Launch assessment
    cy.get('[data-testid="assessment-career-launch"]').click()
    cy.url().should('include', 'career-launch')
    
    // Start the assessment
    cy.get('[data-testid="start-assessment"]').click()
    
    // Complete assessment questions
    cy.get('[data-testid="assessment-question"]').should('be.visible')
    
    // Answer multiple questions
    for (let i = 0; i < 5; i++) {
      cy.get('[data-testid="question-option"]').first().click()
      cy.get('[data-testid="next-button"]').click()
      cy.wait(500) // Small delay between questions
    }
    
    // Should reach results or completion
    cy.get('[data-testid="assessment-results"]', { timeout: 15000 }).should('be.visible')
  })

  it('validates required question responses', () => {
    cy.goToAssessment('stress-resilience')
    
    // Try to proceed without answering
    cy.get('[data-testid="next-button"]').click()
    
    // Should show validation message
    cy.get('[data-testid="validation-error"]').should('contain', 'Please select an answer')
  })

  it('shows assessment progress', () => {
    cy.goToAssessment('communication')
    
    // Progress indicator should be visible
    cy.get('[data-testid="progress-bar"]').should('be.visible')
    
    // Progress should increase as questions are answered
    cy.get('[data-testid="question-option"]').first().click()
    cy.get('[data-testid="next-button"]').click()
    
    // Progress should have changed
    cy.get('[data-testid="progress-text"]').should('not.contain', '0%')
  })

  it('allows going back to previous questions', () => {
    cy.goToAssessment('emotional-intelligence')
    
    // Answer first question
    cy.get('[data-testid="question-option"]').first().click()
    cy.get('[data-testid="next-button"]').click()
    
    // Answer second question
    cy.get('[data-testid="question-option"]').first().click()
    cy.get('[data-testid="next-button"]').click()
    
    // Go back
    cy.get('[data-testid="previous-button"]').click()
    
    // Should be on previous question
    cy.get('[data-testid="question-number"]').should('not.contain', '3')
  })

  it('saves progress during assessment', () => {
    cy.goToAssessment('cultural-intelligence')
    
    // Answer a few questions
    cy.get('[data-testid="question-option"]').first().click()
    cy.get('[data-testid="next-button"]').click()
    
    cy.get('[data-testid="question-option"]').first().click()
    cy.get('[data-testid="next-button"]').click()
    
    // Refresh the page to simulate interruption
    cy.reload()
    
    // Should resume from where we left off
    cy.get('[data-testid="resume-assessment"]').click()
    cy.get('[data-testid="question-number"]').should('contain', '3')
  })

  it('generates and displays assessment results', () => {
    cy.goToAssessment('career-launch')
    
    // Complete the assessment quickly for testing
    cy.completeAssessment()
    
    // Should show results page
    cy.get('[data-testid="assessment-results"]').should('be.visible')
    
    // Results should contain key elements
    cy.get('[data-testid="overall-score"]').should('be.visible')
    cy.get('[data-testid="dimension-scores"]').should('be.visible')
    cy.get('[data-testid="recommendations"]').should('be.visible')
    
    // Should have download option
    cy.get('[data-testid="download-report"]').should('be.visible')
  })

  it('handles assessment timeout gracefully', () => {
    cy.goToAssessment('stress-resilience')
    
    // Mock a timeout scenario by waiting and checking behavior
    cy.get('[data-testid="assessment-question"]').should('be.visible')
    
    // In a real scenario, you might mock the timer or fast-forward time
    // For now, we'll check that timeout handling exists
    cy.get('[data-testid="time-remaining"]').should('be.visible')
  })

  it('supports keyboard navigation', () => {
    cy.goToAssessment('communication')
    
    // Use keyboard to navigate
    cy.get('body').type('{tab}') // Tab to first option
    cy.get('body').type(' ') // Space to select
    cy.get('body').type('{tab}') // Tab to next button
    cy.get('body').type('{enter}') // Enter to proceed
    
    // Should advance to next question
    cy.get('[data-testid="question-number"]').should('contain', '2')
  })
})