import { BottomTabBar } from '@/components/layout/bottom-tab-bar'
import { MiniPlayer } from '@/components/player/mini-player'

type BottomChromeProps = {
  className?: string
}

export function BottomChrome({ className }: BottomChromeProps) {
  return (
    <div
      className={[
        'pointer-events-none absolute inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-[430px] flex-col gap-3 px-[25px] pb-[max(16px,env(safe-area-inset-bottom))]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="pointer-events-auto">
        <MiniPlayer />
      </div>
      <div className="pointer-events-auto">
        <BottomTabBar />
      </div>
    </div>
  )
}
