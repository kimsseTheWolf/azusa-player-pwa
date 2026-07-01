import { type PropsWithChildren } from 'react'
import { useLocation, matchPath } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { BottomChrome } from '@/mobile/navigation/bottom-chrome'
import { routeMetaList } from '@/mobile/navigation/route-config'

type MobileShellProps = PropsWithChildren<{
  className?: string
}>

function getCurrentRouteMeta(pathname: string) {
  return routeMetaList.find((meta) =>
    matchPath({ path: meta.path, end: true }, pathname)
  )
}

export function MobileShell({ children, className }: MobileShellProps) {
  const location = useLocation()
  const currentMeta = getCurrentRouteMeta(location.pathname)
  const showBottomChrome = currentMeta?.showBottomChrome ?? true

  return (
    <div className={cn('relative isolate h-screen h-dvh overflow-hidden bg-background text-foreground', className)}>
      <div className="relative mx-auto h-full w-full max-w-[430px]">
        <main
          className={cn(
            'h-full overflow-y-auto px-[15px] pt-[max(16px,env(safe-area-inset-top))]',
            showBottomChrome ? 'pb-[188px]' : 'pb-[max(16px,env(safe-area-inset-bottom))]'
          )}
        >
          {children}
        </main>
        {showBottomChrome ? <BottomChrome /> : null}
      </div>
    </div>
  )
}
