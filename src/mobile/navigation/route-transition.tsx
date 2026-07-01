import { useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { MobileRouteMeta } from '@/mobile/navigation/route-config'
import { resolveRouteMeta, routeMetaList } from '@/mobile/navigation/route-config'
import { consumeNavigationIntent, type NavigationIntent } from '@/mobile/navigation/navigation-intent'

type StackDirection = -1 | 1
type TransitionKind = 'none' | 'stack'

type TransitionContext = {
  transitionKind: TransitionKind
  direction: StackDirection
}

const IOS_EASING: [number, number, number, number] = [0.32, 0.72, 0, 1]

const transitionVariants = {
  initial: ({ transitionKind, direction }: TransitionContext) => {
    if (transitionKind === 'stack') {
      return {
        opacity: 1,
        x: direction > 0 ? '100%' : '-28%',
      }
    }

    return {
      opacity: 1,
      x: '0%',
    }
  },
  animate: {
    opacity: 1,
    x: '0%',
  },
  exit: ({ transitionKind, direction }: TransitionContext) => {
    if (transitionKind === 'stack') {
      return {
        opacity: 1,
        x: direction > 0 ? '-28%' : '100%',
      }
    }

    return {
      opacity: 1,
      x: '0%',
    }
  },
}

function getStackDirection(currentDepth: number, previousDepth: number): StackDirection {
  return currentDepth >= previousDepth ? 1 : -1
}

export function RouteTransition() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const previousMetaRef = useRef<MobileRouteMeta | null>(null)
  const consumedPathRef = useRef<string | null>(null)
  const intentRef = useRef<NavigationIntent>(null)

  if (consumedPathRef.current !== location.pathname) {
    consumedPathRef.current = location.pathname
    intentRef.current = consumeNavigationIntent()
  }

  const currentMeta = resolveRouteMeta(location.pathname) ?? routeMetaList[0]
  const previousMeta = previousMetaRef.current
  const intent = intentRef.current
  const currentType = currentMeta.type
  const previousType = previousMeta?.type ?? null

  const transitionKind = useMemo<TransitionKind>(() => {
    if (!previousMeta) {
      return 'none'
    }

    if (intent === 'tab') {
      return 'none'
    }

    if (intent === 'replace') {
      return 'none'
    }

    if (intent === 'stack-push') {
      return 'stack'
    }

    if (intent === 'app-back') {
      return 'stack'
    }

    if (navigationType === 'POP' && intent == null) {
      return 'none'
    }

    if (currentType === 'tab' && previousType === 'tab') {
      return 'none'
    }

    return 'stack'
  }, [currentType, intent, navigationType, previousMeta, previousType])

  const direction = getStackDirection(currentMeta.depth, previousMeta?.depth ?? currentMeta.depth)

  useEffect(() => {
    previousMetaRef.current = currentMeta
  }, [currentMeta])

  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={location.pathname}
          custom={{ transitionKind, direction }}
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: transitionKind === 'stack' ? 0.22 : 0,
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
