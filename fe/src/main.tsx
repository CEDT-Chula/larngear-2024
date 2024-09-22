import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // No need for .js extension in TypeScript
import './index.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
