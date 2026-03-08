import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initOfflineListeners } from '@/store/useOfflineStore';
import { Toaster } from 'react-hot-toast';

// Initialize offline listeners for Wein Wrkhas V3
initOfflineListeners();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
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
  </React.StrictMode>
);
