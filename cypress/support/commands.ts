/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in a user
       * @example cy.login('user@example.com', 'password')
       */
      login(email: string, password: string): Chainable<void>
      
      /**
       * Custom command to complete an assessment
       * @example cy.completeAssessment()
       */
      completeAssessment(): Chainable<void>
      
      /**
       * Custom command to wait for loading to complete
       * @example cy.waitForPageLoad()
       */
      waitForPageLoad(): Chainable<void>
      
      /**
       * Custom command to navigate to assessment
       * @example cy.goToAssessment('career-launch')
       */
      goToAssessment(assessmentType: string): Chainable<void>
    }
  }
}

// Custom command for login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth')
  cy.get('[data-testid="email-input"]').type(email)
  cy.get('[data-testid="password-input"]').type(password)
  cy.get('[data-testid="login-button"]').click()
  cy.url().should('not.include', '/auth')
})

// Custom command to complete assessment
Cypress.Commands.add('completeAssessment', () => {
  cy.get('[data-testid="assessment-question"]').should('be.visible')
  
  // Loop through questions and select random answers
  cy.get('body').then(($body) => {
    const selectRandomAnswer = () => {
      cy.get('[data-testid="question-option"]').then(($options) => {
        if ($options.length > 0) {
          const randomIndex = Math.floor(Math.random() * $options.length)
          cy.wrap($options[randomIndex]).click()
        }
      })
      
      cy.get('[data-testid="next-button"]').then(($btn) => {
        if ($btn.length > 0 && !$btn.prop('disabled')) {
          cy.wrap($btn).click()
          
          // Check if there are more questions
          cy.get('body').then(($newBody) => {
            if ($newBody.find('[data-testid="assessment-question"]').length > 0) {
              selectRandomAnswer()
            }
          })
        }
      })
    }
    
    selectRandomAnswer()
  })
})

// Custom command to wait for page load
Cypress.Commands.add('waitForPageLoad', () => {
  // Wait for the page to be fully loaded
  cy.get('[data-testid="loading"]', { timeout: 10000 }).should('not.exist')
  cy.get('body').should('be.visible')
})

// Custom command to navigate to assessment
Cypress.Commands.add('goToAssessment', (assessmentType: string) => {
  cy.visit('/')
  cy.get(`[data-testid="assessment-${assessmentType}"]`).click()
  cy.url().should('include', assessmentType)
  cy.waitForPageLoad()
})

export {}
