import type { PropsWithChildren, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { NavHeader } from '@/components/layout/nav-header'
import { PageContent } from '@/components/layout/page-content'

type StackPageProps = PropsWithChildren<{
  title: ReactNode
  subtitle?: ReactNode
  trailing?: ReactNode
  backTo?: string
  className?: string
  contentClassName?: string
}>

export function StackPage({
  title,
  subtitle,
  trailing,
  backTo,
  className,
  contentClassName,
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
    <section className={cn('flex flex-col', className)}>
      <NavHeader title={title} subtitle={subtitle} trailing={trailing} onBack={handleBack} />
      <PageContent className={contentClassName}>{children}</PageContent>
    </section>
  )
}