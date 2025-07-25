import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import GlobalErrorBoundary from './components/GlobalErrorBoundary'
import './index.css'
import './i18n/config'

console.log('🚀 Main.tsx: Starting application initialization...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ Main.tsx: Root element not found!');
  throw new Error('Root element not found');
}

console.log('✅ Main.tsx: Root element found, creating React root...');

createRoot(rootElement).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </StrictMode>
);

console.log('✅ Main.tsx: React app rendered successfully!');
