describe('Responsive Design E2E Tests', () => {
  const viewports = [
    { device: 'iphone-6', width: 375, height: 667 },
    { device: 'ipad-2', width: 768, height: 1024 },
    { device: 'macbook-15', width: 1440, height: 900 },
  ]

  viewports.forEach(({ device, width, height }) => {
    describe(`${device} (${width}x${height})`, () => {
      beforeEach(() => {
        cy.viewport(width, height)
        cy.visit('/')
      })

      it('displays navigation appropriately', () => {
        if (width < 768) {
          // Mobile: should show hamburger menu
          cy.get('[data-testid="mobile-menu-button"]').should('be.visible')
          cy.get('[data-testid="desktop-nav"]').should('not.be.visible')
        } else {
          // Desktop/Tablet: should show full navigation
          cy.get('[data-testid="desktop-nav"]').should('be.visible')
          cy.get('[data-testid="mobile-menu-button"]').should('not.be.visible')
        }
      })

      it('adapts assessment layout for screen size', () => {
        cy.goToAssessment('career-launch')

        if (width < 768) {
          // Mobile: should stack elements vertically
          cy.get('[data-testid="assessment-container"]').should('have.class', 'mobile-layout')
          cy.get('[data-testid="progress-bar"]').should('have.class', 'full-width')
        } else {
          // Desktop: should use side-by-side layout
          cy.get('[data-testid="assessment-container"]').should('have.class', 'desktop-layout')
        }
      })

      it('ensures text remains readable', () => {
        cy.get('h1').should('have.css', 'font-size').and('match', /\d+px/)
        cy.get('p').should('have.css', 'line-height').and('match', /\d/)
        
        // Check that text doesn't overflow containers
        cy.get('[data-testid="assessment-card"]').each(($card) => {
          cy.wrap($card).should('not.have.css', 'overflow-x', 'scroll')
        })
      })

      it('maintains button accessibility', () => {
        cy.get('button').each(($button) => {
          // Buttons should have minimum touch target size on mobile
          if (width < 768) {
            cy.wrap($button).should('have.css', 'min-height', '44px')
          }
          
          // Buttons should be focusable
          cy.wrap($button).should('not.have.attr', 'tabindex', '-1')
        })
      })

      it('handles forms appropriately', () => {
        cy.visit('/auth')
        
        if (width < 768) {
          // Mobile: form should take full width
          cy.get('[data-testid="auth-form"]').should('have.class', 'w-full')
        }
        
        // Form inputs should be properly sized
        cy.get('input').should('have.css', 'width').and('not.eq', '0px')
      })
    })
  })

  it('tests landscape vs portrait orientations on mobile', () => {
    // Portrait
    cy.viewport(375, 667)
    cy.visit('/')
    cy.get('[data-testid="hero-section"]').should('be.visible')
    
    // Landscape
    cy.viewport(667, 375)
    cy.reload()
    cy.get('[data-testid="hero-section"]').should('be.visible')
    
    // Content should still be accessible in landscape
    cy.get('[data-testid="featured-assessments"]').should('be.visible')
  })

  it('ensures images scale properly', () => {
    const viewports = ['iphone-6', 'ipad-2', 'macbook-15']
    
    viewports.forEach((viewport) => {
      cy.viewport(viewport as any)
      cy.visit('/')
      
      cy.get('img').each(($img) => {
        // Images should not exceed container width
        cy.wrap($img).should(($el) => {
          const imgWidth = $el.width()
          const containerWidth = $el.parent().width()
          expect(imgWidth).to.be.at.most(containerWidth!)
        })
      })
    })
  })
})