import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CrashBoundary } from './components/CrashBoundary.tsx';
import { initCrashReporting } from './utils/crashLog.ts';

initCrashReporting();

createRoot(document.getElementById('root')!).render(
  <CrashBoundary>
    <App />
  </CrashBoundary>
);
