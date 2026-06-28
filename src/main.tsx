import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { MobilePage } from '@/components/layout/mobile-page'
import './index.css'

function PlaceholderHome() {
  return (
    <AppShell>
      <MobilePage
        title="Azusa Player"
        subtitle="iOS-inspired glass UI foundation"
      >
        <div className="rounded-normal border border-border bg-card/80 p-card shadow-component backdrop-blur-component">
          <p className="text-small text-foreground/72">
            Placeholder route only. Page implementations will be added later.
          </p>
        </div>
      </MobilePage>
    </AppShell>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<PlaceholderHome />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
