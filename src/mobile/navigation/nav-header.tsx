import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Pressable } from '@/components/ui/pressable'
import { cn } from '@/lib/utils'

type HeaderTitleBlockProps = {
  title: string
  subtitle?: string
}

function HeaderTitleBlock({ title, subtitle }: HeaderTitleBlockProps) {
  return (
    <div className="space-y-1">
      <p className="text-page-title tracking-[-0.02em] text-foreground">{title}</p>
      {subtitle ? <p className="text-page-subtitle text-foreground/68">{subtitle}</p> : null}
    </div>
  )
}

type LargePageHeaderProps = {
  title: string
  subtitle?: string
  trailing?: ReactNode
  onBack?: () => void
  className?: string
}

export function LargePageHeader({
  title,
  subtitle,
  trailing,
  onBack,
  className,
}: LargePageHeaderProps) {
  return (
    <header className={cn('flex items-start justify-between gap-4', className)}>
      <div className="flex min-w-0 items-start gap-2">
        {onBack ? (
          <Pressable
            variant="ghost"
            size="icon"
            className="mt-1 h-9 w-9 rounded-full"
            type="button"
            onClick={onBack}
            aria-label="返回"
          >
            <ChevronLeft className="h-5 w-5" />
          </Pressable>
        ) : null}
        <HeaderTitleBlock title={title} subtitle={subtitle} />
      </div>
      {trailing ? <div className="flex shrink-0 items-start justify-end">{trailing}</div> : null}
    </header>
  )
}

type CompactNavHeaderProps = {
  title: string
  onBack?: () => void
  trailing?: ReactNode
  className?: string
}

export function CompactNavHeader({ title, onBack, trailing, className }: CompactNavHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex min-h-12 items-center justify-between bg-background/92 px-1 backdrop-blur-component',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-1">
        {onBack ? (
          <Pressable
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            type="button"
            onClick={onBack}
            aria-label="返回"
          >
            <ChevronLeft className="h-4 w-4" />
          </Pressable>
        ) : null}
        <p className="truncate text-[16px] font-semibold text-foreground">{title}</p>
      </div>
      {trailing ? <div className="flex shrink-0 items-center">{trailing}</div> : null}
    </header>
  )
}
