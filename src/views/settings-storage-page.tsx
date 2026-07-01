import { ContentCard } from '@/components/ui/content-card'
import { StackPage } from '@/mobile/navigation/stack-page'

export function SettingsStoragePage() {
  return (
    <StackPage title="存储设置" subtitle="缓存与本地文件" backTo="/more/settings">
      <ContentCard title="存储策略占位">
        <p className="text-page-subtitle text-foreground/72">后续将在这里接入存储策略和容量管理。</p>
      </ContentCard>
    </StackPage>
  )
}
