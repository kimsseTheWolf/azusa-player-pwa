import type { ReactElement } from 'react'
import { AnimatePresence } from 'framer-motion'
import { matchPath, useLocation } from 'react-router-dom'
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

function resolveRoute(pathname: string) {
  return (
    routes.find((route) => matchPath({ path: route.path, end: true }, pathname)) ?? routes[routes.length - 1]
  )
}

export function AppRoutes() {
  const location = useLocation()
  const route = resolveRoute(location.pathname)

  return (
    <AnimatePresence mode="wait" initial={false}>
      <RouteTransitionHost key={location.pathname} type={route.type}>
        {route.element}
      </RouteTransitionHost>
    </AnimatePresence>
  )
}