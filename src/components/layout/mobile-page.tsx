import type { PropsWithChildren, ReactNode } from 'react'
import { TabPage } from '@/components/layout/tab-page'

type MobilePageProps = PropsWithChildren<{
  title: string
  subtitle?: string
  headerSlot?: ReactNode
  className?: string
}>

export function MobilePage({
  title,
  subtitle,
  headerSlot,
  className,
  children,
}: MobilePageProps) {
  return (
    <TabPage title={title} subtitle={subtitle} trailing={headerSlot} className={className}>
      {children}
    </TabPage>
  )
}