import { useParams } from 'react-router-dom'
import { ContentCard } from '@/components/ui/content-card'
import { StackPage } from '@/mobile/navigation/stack-page'

export function PlaylistPage() {
  const { playlistId } = useParams<{ playlistId: string }>()

  return (
    <StackPage title="歌单详情" subtitle={playlistId ? `Playlist #${playlistId}` : '当前歌单'} backTo="/library">
      <ContentCard title="歌单内容占位">
        <p className="text-page-subtitle text-foreground/72">后续将在这里接入完整歌单详情内容。</p>
      </ContentCard>
    </StackPage>
  )
}
