import type { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

type PageContentProps = PropsWithChildren<{
  className?: string
}>

export function PageContent({ className, children }: PageContentProps) {
  return <div className={cn('flex flex-col gap-card-gap', className)}>{children}</div>
}