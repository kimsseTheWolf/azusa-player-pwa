import type { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'

type RouteTransitionHostProps = PropsWithChildren<{
  type: 'tab' | 'stack'
}>

const tabVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const stackVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 24 },
}

export function RouteTransitionHost({ type, children }: RouteTransitionHostProps) {
  const variants = type === 'stack' ? stackVariants : tabVariants

  return (
    <motion.div
      className="min-h-full will-change-transform"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}