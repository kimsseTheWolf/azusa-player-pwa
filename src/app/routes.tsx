import type { ReactElement } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { HomePage } from '@/views/home-page'
import { LibraryPage } from '@/views/library-page'
import { MorePage } from '@/views/more-page'
import { PlaylistPage } from '@/views/library/playlist-page'
import { SettingsPage } from '@/views/more/settings-page'
import { SettingsStoragePage } from '@/views/more/settings-storage-page'
import { RouteTransitionHost } from '@/app/route-transition-host'

type RouteType = 'tab' | 'stack'

type RouteRecord = {
  path: string
  type: RouteType
  element: ReactElement
}

const routes: RouteRecord[] = [
  { path: '/library/playlist/:playlistId', type: 'stack', element: <PlaylistPage /> },
  { path: '/more/settings/storage', type: 'stack', element: <SettingsStoragePage /> },
  { path: '/more/settings', type: 'stack', element: <SettingsPage /> },
  { path: '/library', type: 'tab', element: <LibraryPage /> },
  { path: '/more', type: 'tab', element: <MorePage /> },
  { path: '/', type: 'tab', element: <HomePage /> },
]

export function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<RouteTransitionHost type={route.type}>{route.element}</RouteTransitionHost>}
          />
        ))}
        <Route
          path="*"
          element={<RouteTransitionHost type="tab">
            <HomePage />
          </RouteTransitionHost>}
        />
      </Routes>
    </AnimatePresence>
  )
}