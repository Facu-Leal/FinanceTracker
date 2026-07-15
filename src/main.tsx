import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/custom-bootstrap.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/global.css';
import { initTheme } from './shared/theme';
import App from './App.tsx';

initTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
