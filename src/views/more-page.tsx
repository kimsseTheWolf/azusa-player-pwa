import { ContentCard } from '@/components/ui/content-card'
import { Pressable } from '@/components/ui/pressable'
import { TabPage } from '@/mobile/navigation/tab-page'
import { useMobileNavigation } from '@/mobile/navigation/use-mobile-navigation'

export function MorePage() {
  const mobileNav = useMobileNavigation()

  return (
    <TabPage title="更多" subtitle="设置、关于与其他功能">
      <ContentCard title="设置入口">
        <Pressable
          variant="ghost"
          className="min-h-0 rounded-none border-0 bg-transparent px-0 py-0 text-action text-system-blue !shadow-none !backdrop-blur-none"
          type="button"
          onClick={() => mobileNav.push('/more/settings')}
        >
          打开设置
        </Pressable>
      </ContentCard>
    </TabPage>
  )
}