describe('Homepage E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads the homepage successfully', () => {
    // Check if the main elements are present
    cy.get('h1').should('contain', 'AuthenCore')
    cy.get('nav').should('be.visible')
    
    // Check for key sections
    cy.get('[data-testid="hero-section"]').should('be.visible')
    cy.get('[data-testid="featured-assessments"]').should('be.visible')
  })

  it('displays navigation menu', () => {
    // Check navigation items
    cy.get('nav').within(() => {
      cy.get('a').should('contain', 'Home')
      cy.get('a').should('contain', 'About')
      cy.get('a').should('contain', 'Assessments')
    })
  })

  it('shows featured assessments', () => {
    cy.get('[data-testid="featured-assessments"]').within(() => {
      // Should show assessment cards
      cy.get('[data-testid="assessment-card"]').should('have.length.at.least', 3)
      
      // Each card should have title and description
      cy.get('[data-testid="assessment-card"]').each(($card) => {
        cy.wrap($card).find('h3').should('be.visible')
        cy.wrap($card).find('p').should('be.visible')
        cy.wrap($card).find('button').should('be.visible')
      })
    })
  })

  it('can navigate to assessment pages', () => {
    // Click on first assessment
    cy.get('[data-testid="assessment-card"]').first().within(() => {
      cy.get('button').click()
    })
    
    // Should navigate to an assessment page
    cy.url().should('not.eq', Cypress.config().baseUrl + '/')
    cy.get('h1').should('be.visible')
  })

  it('displays footer information', () => {
    cy.get('footer').should('be.visible')
    cy.get('footer').should('contain', 'AuthenCore')
    cy.get('footer').should('contain', '2024')
  })

  it('is responsive on mobile devices', () => {
    // Test mobile viewport
    cy.viewport('iphone-6')
    
    // Check if mobile menu appears
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible')
    cy.get('[data-testid="mobile-menu-button"]').click()
    
    // Mobile navigation should be visible
    cy.get('[data-testid="mobile-menu"]').should('be.visible')
  })

  it('handles page load performance', () => {
    // Use Cypress performance testing
    cy.visit('/', { timeout: 10000 })
    cy.get('[data-testid="hero-section"]').should('be.visible')
    
    // Check if critical resources loaded quickly
    cy.window().its('performance').invoke('getEntriesByType', 'navigation')
      .then((navigation: any) => {
        expect(navigation[0].loadEventEnd - navigation[0].loadEventStart).to.be.lessThan(3000)
      })
  })
})