import { useNavigate } from 'react-router-dom'
import { setNavigationIntent } from '@/mobile/navigation/navigation-intent'

export function useMobileNavigation() {
  const navigate = useNavigate()

  const switchTab = (to: string) => {
    setNavigationIntent('tab')
    navigate(to, { replace: true })
  }

  const push = (to: string) => {
    setNavigationIntent('stack-push')
    navigate(to)
  }

  const back = (fallback?: string) => {
    if (fallback) {
      // Reserved for future direct-open fallback strategy.
    }

    setNavigationIntent('app-back')
    navigate(-1)
  }

  const replace = (to: string) => {
    setNavigationIntent('replace')
    navigate(to, { replace: true })
  }

  return {
    switchTab,
    push,
    back,
    replace,
  }
}
