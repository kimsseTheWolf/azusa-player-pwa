import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const pressableVariants = cva(
  'inline-flex items-center justify-center rounded-round border border-border bg-card/90 px-4 py-2 text-action text-foreground shadow-component backdrop-blur-component select-none transform-gpu will-change-transform transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        glass: 'glass-surface hover-lift',
        ghost: 'border-transparent bg-transparent shadow-none',
      },
      size: {
        default: 'min-h-11',
        icon: 'h-11 w-11 p-0',
        sm: 'min-h-9 px-3 py-2',
      },
    },
    defaultVariants: {
      variant: 'glass',
      size: 'default',
    },
  }
)

export type PressableProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd'
> &
  VariantProps<typeof pressableVariants>

export const Pressable = React.forwardRef<HTMLButtonElement, PressableProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.93, y: 1.5, opacity: 0.9 }}
        transition={{ type: 'spring', stiffness: 850, damping: 38, mass: 0.4 }}
        className={cn(pressableVariants({ variant, size }), className)}
        {...props}
      >
        {children ?? 'Placeholder'}
      </motion.button>
    )
  }
)

Pressable.displayName = 'Pressable'