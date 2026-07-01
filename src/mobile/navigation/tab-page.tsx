import type { PropsWithChildren, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { LargePageHeader } from '@/mobile/navigation/nav-header'
import { PageContent } from '@/mobile/navigation/page-content'

type TabPageProps = PropsWithChildren<{
  title: string
  subtitle?: string
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
      <LargePageHeader title={title} subtitle={subtitle} trailing={trailing} />
      <PageContent className={contentClassName}>{children}</PageContent>
    </section>
  )
}
