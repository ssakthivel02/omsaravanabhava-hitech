import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import './styles/tokens.css';
import './styles/app.css';

const el = document.getElementById('root');
if (!el) throw new Error('#root missing from index.html');

createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register the hi-tech service worker under its own namespace and actively
// evict any legacy OSB cache left on the device. See public/sw.js.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* offline support is progressive; failure must not break the app */
    });
  });
}
