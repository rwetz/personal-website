// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are bundled locally rather than pulled from fonts.googleapis.com:
// no third-party origin sees visitor IPs, and nothing external can change what loads.
import '@fontsource-variable/inter'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
