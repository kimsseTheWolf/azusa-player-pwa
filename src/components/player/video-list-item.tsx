import { Pressable } from '@/components/ui/pressable'
import { cn } from '@/lib/utils'

type VideoListItemProps = {
  title: string
  uploader: string
  duration: string
  coverUrl?: string
  onClick?: () => void
  className?: string
}

export function VideoListItem({
  title,
  uploader,
  duration,
  coverUrl,
  onClick,
  className,
}: VideoListItemProps) {
  return (
    <Pressable
      variant="ghost"
      onClick={onClick}
      className={cn(
        'h-[70px] w-full justify-start rounded-normal border-0 bg-transparent p-0 pr-[7px] text-left !shadow-none !backdrop-blur-none',
        className
      )}
      motionWhileTap={{
        scale: 0.93,
        y: 1.5,
        opacity: 0.9,
      }}
    >
      <div className="flex h-full w-full items-center gap-card">
        <div className="relative h-full shrink-0 overflow-hidden rounded-small bg-system-cyan aspect-video">
          {coverUrl ? (
            <img src={coverUrl} alt="视频封面" className="h-full w-full object-cover" />
          ) : null}

          <span
            className="pointer-events-none absolute bottom-2 left-3 text-[12px] leading-none text-white"
            style={{ textShadow: '0 0 4px rgba(0, 0, 0, 0.25)' }}
          >
            {duration}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="overflow-hidden text-[14px] font-semibold leading-[1.3] text-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {title}
          </p>
          <p className="mt-[5px] truncate text-[12px] leading-[1.3] text-foreground/72">{uploader}</p>
        </div>
      </div>
    </Pressable>
  )
}