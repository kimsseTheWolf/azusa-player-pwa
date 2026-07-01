import { Link } from 'react-router-dom'
import { ContentCard } from '@/components/ui/content-card'
import { TabPage } from '@/mobile/navigation/tab-page'

export function MorePage() {
  return (
    <TabPage title="更多" subtitle="设置、关于与其他功能">
      <ContentCard title="设置入口">
        <Link to="/more/settings" className="text-action text-system-blue">
          打开设置
        </Link>
      </ContentCard>
    </TabPage>
  )
}