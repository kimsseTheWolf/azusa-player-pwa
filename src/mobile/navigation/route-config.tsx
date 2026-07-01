import type { ReactElement } from 'react'
import { matchPath } from 'react-router-dom'
import { HomePage } from '@/views/home-page'
import { LibraryPage } from '@/views/library-page'
import { MorePage } from '@/views/more-page'
import { PlaylistPage } from '@/views/playlist-page'
import { SettingsPage } from '@/views/settings-page'
import { SettingsStoragePage } from '@/views/settings-storage-page'

export type RouteType = 'tab' | 'stack'
export type TabId = 'home' | 'library' | 'more'

export type MobileRouteMeta = {
  path: string
  type: RouteType
  element: ReactElement
  tabId?: TabId
  showBottomChrome: boolean
}

export const routeMetaList: MobileRouteMeta[] = [
  {
    path: '/',
    type: 'tab',
    element: <HomePage />,
    tabId: 'home',
    showBottomChrome: true,
  },
  {
    path: '/library',
    type: 'tab',
    element: <LibraryPage />,
    tabId: 'library',
    showBottomChrome: true,
  },
  {
    path: '/more',
    type: 'tab',
    element: <MorePage />,
    tabId: 'more',
    showBottomChrome: true,
  },
  {
    path: '/library/playlist/:playlistId',
    type: 'stack',
    element: <PlaylistPage />,
    showBottomChrome: false,
  },
  {
    path: '/more/settings',
    type: 'stack',
    element: <SettingsPage />,
    showBottomChrome: false,
  },
  {
    path: '/more/settings/storage',
    type: 'stack',
    element: <SettingsStoragePage />,
    showBottomChrome: false,
  },
]

export function resolveRouteMeta(pathname: string) {
  return routeMetaList.find((meta) => matchPath({ path: meta.path, end: true }, pathname))
}
