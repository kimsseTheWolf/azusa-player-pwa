import { Link } from 'react-router-dom'
import { ContentCard } from '@/components/ui/content-card'
import { StackPage } from '@/mobile/navigation/stack-page'

export function SettingsPage() {
  return (
    <StackPage title="设置" subtitle="应用与播放行为" backTo="/more">
      <ContentCard title="存储">
        <p className="text-page-subtitle text-foreground/72">管理缓存与下载空间。</p>
        <Link to="/more/settings/storage" className="text-action text-system-blue">
          打开存储设置
        </Link>
      </ContentCard>
    </StackPage>
  )
}
