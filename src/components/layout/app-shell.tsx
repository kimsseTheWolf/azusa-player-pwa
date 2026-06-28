import type { PropsWithChildren } from 'react'
import { BottomTabBar } from '@/components/layout/bottom-tab-bar'
import { MiniPlayer } from '@/components/player/mini-player'
import { cn } from '@/lib/utils'

type AppShellProps = PropsWithChildren<{
  className?: string
}>

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className={cn('min-h-screen min-h-dvh bg-background text-foreground', className)}>
      <div className="mx-auto flex min-h-screen min-h-dvh w-full max-w-[430px] flex-col safe-area-px safe-area-pt safe-area-pb">
        <main className="flex-1 pb-[170px]">{children}</main>
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-[430px] flex-col gap-3 px-[25px] pb-[max(16px,env(safe-area-inset-bottom))]">
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