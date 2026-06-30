import { Ellipsis, Globe, Library } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Pressable } from '@/components/ui/pressable'
import { cn } from '@/lib/utils'

const items = [
  { label: '首页', icon: Globe, to: '/' },
  { label: '资料库', icon: Library, to: '/library' },
  { label: '更多', icon: Ellipsis, to: '/more' },
] as const

export function BottomTabBar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="glass-surface mx-auto w-fit rounded-[26px] px-1 py-1.5">
      <ul className="flex items-stretch gap-0">
        {items.map(({ label, icon: Icon, to }) => {
          const isActive = location.pathname === to

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
              onClick={() => navigate(to)}
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