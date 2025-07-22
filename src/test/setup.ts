import '@testing-library/jest-dom'
import { expect, afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extends Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test case
afterEach(() => {
  cleanup()
})

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root!: Element | null
  readonly rootMargin!: string
  readonly thresholds!: ReadonlyArray<number>

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
  
  disconnect(): void {}
  observe(target: Element): void {}
  unobserve(target: Element): void {}
  takeRecords(): IntersectionObserverEntry[] { return [] }
}

global.IntersectionObserver = MockIntersectionObserver

// Mock ResizeObserver
class MockResizeObserver implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {}
  
  disconnect(): void {}
  observe(target: Element, options?: ResizeObserverOptions): void {}
  unobserve(target: Element): void {}
}

global.ResizeObserver = MockResizeObserver

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
})

// Suppress console warnings for tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeEach(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return
    }
    originalConsoleError.apply(console, args)
  }

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
        args[0].includes('componentWillMount'))
    ) {
      return
    }
    originalConsoleWarn.apply(console, args)
  }
})

afterEach(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
  vi.clearAllMocks()
})