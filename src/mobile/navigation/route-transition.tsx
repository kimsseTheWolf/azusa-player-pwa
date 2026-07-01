import { useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import type { RouteType } from '@/mobile/navigation/route-config'
import { resolveRouteMeta } from '@/mobile/navigation/route-config'

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
        x: direction > 0 ? '22%' : '-8%',
      }
    }

    return {
      opacity: 0,
      x: '2%',
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
        x: direction > 0 ? '-12%' : '22%',
      }
    }

    return {
      opacity: 0,
      x: '-2%',
    }
  },
}

function getStackDirection(navigationType: ReturnType<typeof useNavigationType>): StackDirection {
  return navigationType === 'POP' ? -1 : 1
}

export function RouteTransition() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const previousTypeRef = useRef<RouteType | null>(null)

  const currentType = resolveRouteMeta(location.pathname)?.type ?? 'tab'
  const previousType = previousTypeRef.current

  const routeType = useMemo<RouteType>(() => {
    if (currentType === 'stack' || previousType === 'stack') {
      return 'stack'
    }

    return 'tab'
  }, [currentType, previousType])

  const direction = getStackDirection(navigationType)

  useEffect(() => {
    previousTypeRef.current = currentType
  }, [currentType])

  return (
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
        className="will-change-transform"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  )
}
