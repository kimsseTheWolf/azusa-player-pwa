import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { HomePage } from '@/views/home-page'
import { LibraryPage } from '@/views/library-page'
import { MorePage } from '@/views/more-page'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  </StrictMode>
)
