import { StackPage } from '@/components/layout/stack-page'
import { useParams } from 'react-router-dom'

export function PlaylistPage() {
  const { playlistId } = useParams()

  return (
    <StackPage title="播放列表" subtitle="二级页面占位，后续接入真实列表内容" backTo="/library">
      <p className="text-[15px] leading-[1.55] text-foreground/78">当前播放列表 ID: {playlistId}</p>
      <p className="text-[15px] leading-[1.55] text-foreground/78">这里先保留播放列表详情页结构。</p>
    </StackPage>
  )
}