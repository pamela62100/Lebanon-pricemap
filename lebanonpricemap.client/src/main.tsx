import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import App from './App';
import './index.css';
import { initOfflineListeners } from '@/store/useOfflineStore';
import { Toaster } from 'react-hot-toast';

initOfflineListeners();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: 'var(--bg-surface)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-primary)',
          fontFamily: 'Plus Jakarta Sans',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-glass)'
        }
      }} />
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
