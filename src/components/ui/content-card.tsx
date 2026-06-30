import type { PropsWithChildren, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ContentCardProps = PropsWithChildren<{
  title: ReactNode
  actions?: ReactNode
  className?: string
  contentClassName?: string
}>

export function ContentCard({
  title,
  actions,
  className,
  contentClassName,
  children,
}: ContentCardProps) {
  return (
    <section
      className={cn(
        'glass-surface rounded-normal !border-0 p-card-gap',
        'flex flex-col gap-card',
        className
      )}
    >
      <h2 className="text-[16px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground">
        {title}
      </h2>

      <div className={cn('flex flex-col gap-card', contentClassName)}>{children}</div>

      {actions ? <div className="flex items-center justify-center gap-card">{actions}</div> : null}
    </section>
  )
}