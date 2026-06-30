import { PlayerSheet } from '@/components/player/player-sheet'

export function AppOverlayLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <PlayerSheet />
    </div>
  )
}