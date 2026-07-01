import { useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { MobileRouteMeta, RouteType } from '@/mobile/navigation/route-config'
import { resolveRouteMeta, routeMetaList } from '@/mobile/navigation/route-config'

type StackDirection = -1 | 1

type TransitionContext = {
  routeType: RouteType
  direction: StackDirection
}

const IOS_EASING: [number, number, number, number] = [0.32, 0.72, 0, 1]

const transitionVariants = {
  initial: ({ routeType, direction }: TransitionContext) => {
    if (routeType === 'stack') {
      return {
        opacity: 1,
        x: direction > 0 ? '100%' : '-28%',
      }
    }

    return {
      opacity: 0,
      x: '0%',
    }
  },
  animate: {
    opacity: 1,
    x: '0%',
  },
  exit: ({ routeType, direction }: TransitionContext) => {
    if (routeType === 'stack') {
      return {
        opacity: 1,
        x: direction > 0 ? '-28%' : '100%',
      }
    }

    return {
      opacity: 0,
      x: '0%',
    }
  },
}

function getStackDirection(currentDepth: number, previousDepth: number): StackDirection {
  return currentDepth >= previousDepth ? 1 : -1
}

export function RouteTransition() {
  const location = useLocation()
  const previousMetaRef = useRef<MobileRouteMeta | null>(null)

  const currentMeta = resolveRouteMeta(location.pathname) ?? routeMetaList[0]
  const previousMeta = previousMetaRef.current
  const currentType = currentMeta.type
  const previousType = previousMeta?.type ?? null

  const routeType = useMemo<RouteType>(() => {
    if (currentType === 'stack' || previousType === 'stack') {
      return 'stack'
    }

    return 'tab'
  }, [currentType, previousType])

  const direction = getStackDirection(currentMeta.depth, previousMeta?.depth ?? currentMeta.depth)

  useEffect(() => {
    previousMetaRef.current = currentMeta
  }, [currentMeta])

  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={location.pathname}
          custom={{ routeType, direction }}
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: routeType === 'stack' ? 0.22 : 0.18,
            ease: IOS_EASING,
          }}
          className={cn(
            'absolute inset-0 overflow-y-auto bg-background will-change-transform',
            currentMeta.showBottomChrome
              ? 'pb-[max(96px,env(safe-area-inset-bottom))]'
              : 'pb-[max(16px,env(safe-area-inset-bottom))]'
          )}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
