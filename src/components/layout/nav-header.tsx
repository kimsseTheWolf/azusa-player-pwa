import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Pressable } from '@/components/ui/pressable'
import { cn } from '@/lib/utils'

type NavHeaderProps = {
  title: ReactNode
  subtitle?: ReactNode
  trailing?: ReactNode
  onBack: () => void
  className?: string
}

export function NavHeader({ title, subtitle, trailing, onBack, className }: NavHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-20 -mx-page-x bg-background/78 px-page-x pb-4 pt-4 backdrop-blur-md',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Pressable variant="ghost" size="icon" aria-label="返回" type="button" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Pressable>

        <div className="min-w-0 flex-1 space-y-1 pt-0.5">
          <p className="text-page-title tracking-[-0.02em] text-foreground">{title}</p>
          {subtitle ? <p className="text-page-subtitle text-foreground/68">{subtitle}</p> : null}
        </div>

        {trailing ? <div className="flex shrink-0 items-start justify-end">{trailing}</div> : null}
      </div>
    </header>
  )
}