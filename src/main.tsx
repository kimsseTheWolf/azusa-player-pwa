import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MobileRoutes } from '@/mobile/navigation/mobile-routes'
import { MobileShell } from '@/mobile/navigation/mobile-shell'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MobileShell>
        <MobileRoutes />
      </MobileShell>
    </BrowserRouter>
  </StrictMode>
)
