/**
 * 📄 Smart OCR Tool
 * Copyright (c) 2026 Arun Gupta
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
