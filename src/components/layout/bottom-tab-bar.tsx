import { Compass, Library, Search } from 'lucide-react'
import { Pressable } from '@/components/ui/pressable'

const items = [
  { label: 'Discover', icon: Compass },
  { label: 'Search', icon: Search },
  { label: 'Library', icon: Library },
] as const

export function BottomTabBar() {
  return (
    <nav className="glass-surface mx-auto w-fit rounded-[26px] px-1 py-1.5">
      <ul className="flex items-stretch gap-0">
        {items.map(({ label, icon: Icon }) => (
          <li key={label} className="w-[78px]">
            <Pressable
              variant="ghost"
              className="appearance-none flex min-h-[48px] w-full flex-col gap-0.5 rounded-[22px] !border-transparent !bg-transparent px-1.5 py-1.5 text-foreground/72 !shadow-none !backdrop-blur-none"
              aria-label={label}
              type="button"
            >
              <Icon className="h-4 w-4" strokeWidth={2.2} />
              <span className="text-small">{label}</span>
            </Pressable>
          </li>
        ))}
      </ul>
    </nav>
  )
}