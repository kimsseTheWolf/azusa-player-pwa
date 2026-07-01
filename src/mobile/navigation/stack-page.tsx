import type { PropsWithChildren, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { CompactNavHeader, LargePageHeader } from '@/mobile/navigation/nav-header'
import { PageContent } from '@/mobile/navigation/page-content'
import { useMobileNavigation } from '@/mobile/navigation/use-mobile-navigation'

type StackPageProps = PropsWithChildren<{
  title: string
  subtitle?: string
  trailing?: ReactNode
  backTo?: string
  className?: string
  contentClassName?: string
  showCompactHeader?: boolean
}>

export function StackPage({
  title,
  subtitle,
  trailing,
  backTo,
  className,
  contentClassName,
  showCompactHeader = false,
  children,
}: StackPageProps) {
  const mobileNav = useMobileNavigation()

  const handleBack = () => {
    mobileNav.back(backTo)
  }

  return (
    <section className={cn('flex flex-col gap-5 pt-2', className)}>
      {showCompactHeader ? <CompactNavHeader title={title} onBack={handleBack} trailing={trailing} /> : null}
      <LargePageHeader title={title} subtitle={subtitle} trailing={trailing} onBack={handleBack} />
      <PageContent className={contentClassName}>{children}</PageContent>
    </section>
  )
}
