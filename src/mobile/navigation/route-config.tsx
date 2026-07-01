import type { ReactElement } from 'react'
import { HomePage } from '@/views/home-page'
import { LibraryPage } from '@/views/library-page'
import { MorePage } from '@/views/more-page'

type RouteType = 'tab' | 'stack'
type TabId = 'home' | 'library' | 'more'

export type MobileRouteMeta = {
  path: string
  type: RouteType
  element: ReactElement
  tabId?: TabId
  showBottomChrome: boolean
}

type StackPlaceholderPageProps = {
  title: string
}

function StackPlaceholderPage({ title }: StackPlaceholderPageProps) {
  return (
    <section className="flex min-h-[40vh] flex-col gap-3 pt-4">
      <h1 className="text-page-title tracking-[-0.02em] text-foreground">{title}</h1>
      <p className="text-page-subtitle text-foreground/68">占位页面，后续将接入完整的 stack 页面模板。</p>
    </section>
  )
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
    element: <StackPlaceholderPage title="歌单详情" />,
    showBottomChrome: false,
  },
  {
    path: '/more/settings',
    type: 'stack',
    element: <StackPlaceholderPage title="设置" />,
    showBottomChrome: false,
  },
  {
    path: '/more/settings/storage',
    type: 'stack',
    element: <StackPlaceholderPage title="存储设置" />,
    showBottomChrome: false,
  },
]
