import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import MateriaPage from './MateriaPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MateriaPage />
  </StrictMode>
);
