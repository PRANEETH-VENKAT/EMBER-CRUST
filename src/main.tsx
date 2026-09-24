import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeVipDevtoolsClue } from './config/access';

// Initialize hidden clue trail for developers inspecting in DevTools
initializeVipDevtoolsClue();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
