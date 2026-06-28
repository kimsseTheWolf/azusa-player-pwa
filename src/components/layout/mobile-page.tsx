import type { PropsWithChildren, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

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
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={cn('flex flex-col gap-5 pt-4', className)}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-page-title tracking-[-0.02em] text-foreground">{title}</p>
          {subtitle ? (
            <p className="text-page-subtitle text-foreground/68">{subtitle}</p>
          ) : null}
        </div>
        {headerSlot}
      </header>

      <div className="flex flex-col gap-card-gap">{children}</div>
    </motion.section>
  )
}