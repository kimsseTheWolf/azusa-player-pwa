import type { PropsWithChildren, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { CompactNavHeader, LargePageHeader } from '@/mobile/navigation/nav-header'
import { PageContent } from '@/mobile/navigation/page-content'

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
  const navigate = useNavigate()

  const handleBack = () => {
    if (backTo) {
      navigate(backTo)
      return
    }

    navigate(-1)
  }

  return (
    <section className={cn('flex flex-col gap-5 pt-2', className)}>
      {showCompactHeader ? <CompactNavHeader title={title} onBack={handleBack} trailing={trailing} /> : null}
      <LargePageHeader title={title} subtitle={subtitle} trailing={trailing} onBack={handleBack} />
      <PageContent className={contentClassName}>{children}</PageContent>
    </section>
  )
}
