import { StackPage } from '@/components/layout/stack-page'

export function SettingsStoragePage() {
  return (
    <StackPage title="存储管理" subtitle="设置子页结构占位" backTo="/more/settings">
      <p className="text-[15px] leading-[1.55] text-foreground/78">这里后续会展示下载缓存与本地存储信息。</p>
    </StackPage>
  )
}