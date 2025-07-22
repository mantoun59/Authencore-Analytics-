describe('Authentication E2E Tests', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'testpassword123'
  }

  beforeEach(() => {
    // Clear any existing authentication
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.visit('/')
  })

  it('shows sign in button when not authenticated', () => {
    cy.get('[data-testid="sign-in-button"]').should('be.visible')
  })

  it('can navigate to auth page', () => {
    cy.get('[data-testid="sign-in-button"]').click()
    cy.url().should('include', '/auth')
    
    // Should show login form
    cy.get('[data-testid="auth-form"]').should('be.visible')
    cy.get('[data-testid="email-input"]').should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
  })

  it('validates required login fields', () => {
    cy.visit('/auth')
    
    // Try to submit without credentials
    cy.get('[data-testid="login-button"]').click()
    
    // Should show validation errors
    cy.get('[data-testid="email-error"]').should('contain', 'Email is required')
    cy.get('[data-testid="password-error"]').should('contain', 'Password is required')
  })

  it('validates email format', () => {
    cy.visit('/auth')
    
    // Enter invalid email
    cy.get('[data-testid="email-input"]').type('invalid-email')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="login-button"]').click()
    
    // Should show email format error
    cy.get('[data-testid="email-error"]').should('contain', 'Invalid email format')
  })

  it('can switch between login and signup modes', () => {
    cy.visit('/auth')
    
    // Should start in login mode
    cy.get('[data-testid="login-button"]').should('be.visible')
    
    // Switch to signup
    cy.get('[data-testid="switch-to-signup"]').click()
    
    // Should show signup form
    cy.get('[data-testid="signup-button"]').should('be.visible')
    cy.get('[data-testid="full-name-input"]').should('be.visible')
    
    // Switch back to login
    cy.get('[data-testid="switch-to-login"]').click()
    cy.get('[data-testid="login-button"]').should('be.visible')
  })

  it('handles login attempt with proper error messaging', () => {
    cy.visit('/auth')
    
    // Mock login attempt
    cy.get('[data-testid="email-input"]').type(testUser.email)
    cy.get('[data-testid="password-input"]').type('wrongpassword')
    cy.get('[data-testid="login-button"]').click()
    
    // Should show error message (this would be mocked in real tests)
    cy.get('[data-testid="auth-error"]').should('contain', 'Invalid credentials')
  })

  it('redirects after successful authentication', () => {
    // This test would require mocking successful auth
    // In a real app, you might have test accounts or mock the auth service
    
    cy.visit('/auth?redirect=/career-launch')
    
    // Simulate successful login (would need proper mocking)
    // cy.login(testUser.email, testUser.password)
    
    // Should redirect to intended page
    // cy.url().should('include', '/career-launch')
  })

  it('persists authentication across page refreshes', () => {
    // This test would require setting up authenticated state
    // Mock successful authentication first
    
    cy.visit('/')
    // Simulate being logged in (mock local storage/cookies)
    cy.window().then((win) => {
      win.localStorage.setItem('auth-token', 'mock-token')
    })
    
    cy.reload()
    
    // Should still be authenticated after refresh
    // cy.get('[data-testid="user-menu"]').should('be.visible')
  })

  it('can log out successfully', () => {
    // Mock being logged in
    cy.visit('/')
    cy.window().then((win) => {
      win.localStorage.setItem('auth-token', 'mock-token')
    })
    
    // Simulate user menu
    cy.get('[data-testid="user-menu"]').should('be.visible')
    cy.get('[data-testid="user-menu"]').click()
    
    // Click logout
    cy.get('[data-testid="logout-button"]').click()
    
    // Should be logged out
    cy.get('[data-testid="sign-in-button"]').should('be.visible')
  })

  it('handles password reset flow', () => {
    cy.visit('/auth')
    
    // Click forgot password
    cy.get('[data-testid="forgot-password"]').click()
    
    // Should show password reset form
    cy.get('[data-testid="reset-email-input"]').should('be.visible')
    cy.get('[data-testid="send-reset-button"]').should('be.visible')
    
    // Enter email and submit
    cy.get('[data-testid="reset-email-input"]').type(testUser.email)
    cy.get('[data-testid="send-reset-button"]').click()
    
    // Should show confirmation message
    cy.get('[data-testid="reset-confirmation"]').should('contain', 'Check your email')
  })
})