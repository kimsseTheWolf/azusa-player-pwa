import { Ellipsis, Globe, Library } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Pressable } from '@/components/ui/pressable'
import { cn } from '@/lib/utils'
import { resolveRouteMeta } from '@/mobile/navigation/route-config'
import { useMobileNavigation } from '@/mobile/navigation/use-mobile-navigation'

const items = [
  { label: '首页', icon: Globe, to: '/', tabId: 'home' },
  { label: '资料库', icon: Library, to: '/library', tabId: 'library' },
  { label: '更多', icon: Ellipsis, to: '/more', tabId: 'more' },
] as const

export function BottomTabBar() {
  const location = useLocation()
  const mobileNav = useMobileNavigation()
  const currentTabId = resolveRouteMeta(location.pathname)?.tabId

  return (
    <nav className="glass-surface mx-auto w-fit rounded-[26px] px-1 py-1.5">
      <ul className="flex items-stretch gap-0">
        {items.map(({ label, icon: Icon, to, tabId }) => {
          const isActive = currentTabId ? currentTabId === tabId : location.pathname === to

          return (
          <li key={label} className="w-[78px]">
            <Pressable
              variant="ghost"
              className={cn(
                'appearance-none flex min-h-[48px] w-full flex-col gap-0.5 rounded-[22px] !border-transparent !bg-transparent px-1.5 py-1.5 !shadow-none !backdrop-blur-none',
                isActive ? 'text-system-blue' : 'text-foreground/72'
              )}
              aria-label={label}
              type="button"
              onClick={() => mobileNav.switchTab(to)}
            >
              <Icon className="h-4 w-4" strokeWidth={2.2} />
              <span className="text-small">{label}</span>
            </Pressable>
          </li>
          )
        })}
      </ul>
    </nav>
  )
}