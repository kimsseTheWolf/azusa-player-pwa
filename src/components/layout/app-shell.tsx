import type { PropsWithChildren } from 'react'
import { BottomTabBar } from '@/components/layout/bottom-tab-bar'
import { MiniPlayer } from '@/components/player/mini-player'
import { cn } from '@/lib/utils'

type AppShellProps = PropsWithChildren<{
  className?: string
}>

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className={cn('h-screen h-dvh overflow-hidden bg-background text-foreground', className)}>
      <div className="relative mx-auto h-full w-full max-w-[430px]">
        <main className="h-full overflow-y-auto px-[25px] pt-[max(16px,env(safe-area-inset-top))] pb-[188px]">
          {children}
        </main>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-[430px] flex-col gap-3 px-[25px] pb-[max(16px,env(safe-area-inset-bottom))]">
          <div className="pointer-events-auto">
            <MiniPlayer />
          </div>
          <div className="pointer-events-auto">
            <BottomTabBar />
          </div>
        </div>
      </div>
    </div>
  )
}