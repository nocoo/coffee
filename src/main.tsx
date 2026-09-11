import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { CoffeeProvider } from './lib/context';

const root = document.getElementById('root');
if (!root) throw new Error('Application root is missing');
createRoot(root).render(
  <StrictMode>
    <CoffeeProvider>
      <App />
    </CoffeeProvider>
  </StrictMode>,
);
