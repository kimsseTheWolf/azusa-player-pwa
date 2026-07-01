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
  depth: number
  element: ReactElement
  tabId?: TabId
  showBottomChrome: boolean
}

export const routeMetaList: MobileRouteMeta[] = [
  {
    path: '/',
    type: 'tab',
    depth: 0,
    element: <HomePage />,
    tabId: 'home',
    showBottomChrome: true,
  },
  {
    path: '/library',
    type: 'tab',
    depth: 0,
    element: <LibraryPage />,
    tabId: 'library',
    showBottomChrome: true,
  },
  {
    path: '/more',
    type: 'tab',
    depth: 0,
    element: <MorePage />,
    tabId: 'more',
    showBottomChrome: true,
  },
  {
    path: '/library/playlist/:playlistId',
    type: 'stack',
    depth: 1,
    element: <PlaylistPage />,
    tabId: 'library',
    showBottomChrome: false,
  },
  {
    path: '/more/settings',
    type: 'stack',
    depth: 1,
    element: <SettingsPage />,
    tabId: 'more',
    showBottomChrome: false,
  },
  {
    path: '/more/settings/storage',
    type: 'stack',
    depth: 2,
    element: <SettingsStoragePage />,
    tabId: 'more',
    showBottomChrome: false,
  },
]

export function resolveRouteMeta(pathname: string) {
  return routeMetaList.find((meta) => matchPath({ path: meta.path, end: true }, pathname))
}
