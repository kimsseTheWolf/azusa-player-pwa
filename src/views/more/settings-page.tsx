import { StackPage } from '@/components/layout/stack-page'

export function SettingsPage() {
  return (
    <StackPage title="设置" subtitle="更多页的二级入口占位" backTo="/more">
      <p className="text-[15px] leading-[1.55] text-foreground/78">这里后续会放常规设置项。</p>
    </StackPage>
  )
}