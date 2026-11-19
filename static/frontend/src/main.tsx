// Polyfill window.__bridge for standalone preview outside of Forge iframes
if (typeof window !== 'undefined' && !(window as any).__bridge) {
  (window as any).__bridge = {
    callBridge: () => Promise.reject(new Error('[ForgeBridge] Standalone preview mode active.')),
  };
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
