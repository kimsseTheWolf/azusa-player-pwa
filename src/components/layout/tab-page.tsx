import type { PropsWithChildren, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { PageContent } from '@/components/layout/page-content'

type TabPageProps = PropsWithChildren<{
  title: ReactNode
  subtitle?: ReactNode
  trailing?: ReactNode
  className?: string
  contentClassName?: string
}>

export function TabPage({
  title,
  subtitle,
  trailing,
  className,
  contentClassName,
  children,
}: TabPageProps) {
  return (
    <section className={cn('flex flex-col gap-5 pt-4', className)}>
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-page-title tracking-[-0.02em] text-foreground">{title}</p>
          {subtitle ? <p className="text-page-subtitle text-foreground/68">{subtitle}</p> : null}
        </div>

        {trailing ? <div className="flex shrink-0 items-start justify-end">{trailing}</div> : null}
      </header>

      <PageContent className={contentClassName}>{children}</PageContent>
    </section>
  )
}