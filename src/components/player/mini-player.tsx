import { Pause, Waves } from 'lucide-react'
import { Pressable } from '@/components/ui/pressable'

export function MiniPlayer() {
  return (
    <section className="glass-surface rounded-normal p-card">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-small bg-white/10 text-system-cyan">
          <Waves className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-action text-foreground text-[12px]">Now Playing Placeholder</p>
          <p className="truncate text-small text-foreground/64 text-[12px]">
            Mock metadata only, no playback logic attached.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* <Pressable variant="ghost" size="icon" aria-label="Previous track" type="button">
            <SkipBack className="h-4 w-4" />
          </Pressable> */}
          <Pressable size="icon" aria-label="Pause" type="button">
            <Pause className="h-4 w-4" />
          </Pressable>
          {/* <Pressable variant="ghost" size="icon" aria-label="Next track" type="button">
            <SkipForward className="h-4 w-4" />
          </Pressable> */}
        </div>
      </div>
    </section>
  )
}