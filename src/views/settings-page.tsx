import { ContentCard } from '@/components/ui/content-card'
import { Pressable } from '@/components/ui/pressable'
import { StackPage } from '@/mobile/navigation/stack-page'
import { useMobileNavigation } from '@/mobile/navigation/use-mobile-navigation'

export function SettingsPage() {
  const mobileNav = useMobileNavigation()

  return (
    <StackPage title="设置" subtitle="应用与播放行为" backTo="/more">
      <ContentCard title="存储">
        <p className="text-page-subtitle text-foreground/72">管理缓存与下载空间。</p>
        <Pressable
          variant="ghost"
          className="min-h-0 rounded-none border-0 bg-transparent px-0 py-0 text-action text-system-blue !shadow-none !backdrop-blur-none"
          type="button"
          onClick={() => mobileNav.push('/more/settings/storage')}
        >
          打开存储设置
        </Pressable>
      </ContentCard>
    </StackPage>
  )
}
