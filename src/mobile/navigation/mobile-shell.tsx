import { type PropsWithChildren } from 'react'
import { useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { BottomChrome } from '@/mobile/navigation/bottom-chrome'
import { resolveRouteMeta } from '@/mobile/navigation/route-config'

type MobileShellProps = PropsWithChildren<{
  className?: string
}>

export function MobileShell({ children, className }: MobileShellProps) {
  const location = useLocation()
  const currentMeta = resolveRouteMeta(location.pathname)
  const showBottomChrome = currentMeta?.showBottomChrome ?? true

  return (
    <div className={cn('relative isolate h-screen h-dvh overflow-hidden bg-background text-foreground', className)}>
      <div className="relative mx-auto h-full w-full max-w-[430px]">
        <main
          className="relative h-full overflow-hidden px-[15px] pt-[max(16px,env(safe-area-inset-top))]"
        >
          {children}
        </main>
        {showBottomChrome ? <BottomChrome /> : null}
      </div>
    </div>
  )
}
