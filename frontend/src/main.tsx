import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'   // <-Tailwind
import { ThemeLanguageProvider } from "./context/ThemeLanguageContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeLanguageProvider>
      <App />
    </ThemeLanguageProvider>
  </React.StrictMode>
);
