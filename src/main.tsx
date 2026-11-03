import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept Google Maps billing and quota failures to trigger fallback seamlessly
if (typeof window !== 'undefined') {
  (window as any).gm_authFailure = () => {
    window.dispatchEvent(new CustomEvent('gmp-billing-error', { 
      detail: { reason: 'BillingNotEnabledMapError' } 
    }));
  };

  const origError = console.error;
  console.error = (...args: unknown[]) => {
    origError.apply(console, args);
    const msg = args.map((a) => String(a)).join(' ');
    if (
      msg.includes('BillingNotEnabledMapError') ||
      msg.includes('OverQuotaMapError') ||
      msg.includes('QuotaExceededError') ||
      msg.includes('gm_authFailure') ||
      msg.includes('ApiNotActivatedMapError')
    ) {
      window.dispatchEvent(new CustomEvent('gmp-billing-error', { 
        detail: { reason: 'BillingNotEnabledMapError', rawMessage: msg } 
      }));
    }
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

