import { useState } from 'react'
import { MobilePage } from '@/components/layout/mobile-page'
import { ActionInput } from '@/components/ui/action-input'

export function HomePage() {
  const [query, setQuery] = useState('')

  return (
    <MobilePage title="首页" subtitle="今天想听点什么呢？">
      <ActionInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="搜索单曲，歌单，以及播放列表"
        autoHideActionWhenEmpty
        actionAriaLabel="开始搜索"
      />
    </MobilePage>
  )
}