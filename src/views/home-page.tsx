import { useState } from 'react'
import { TabPage } from '@/components/layout/tab-page'
import { ActionInput } from '@/components/ui/action-input'
import { ContentCard } from '@/components/ui/content-card'
import { VideoListItem } from '@/components/player/video-list-item'
import { Pressable } from '@/components/ui/pressable'
import { Avatar } from '@/components/ui/avatar'

export function HomePage() {
  const [query, setQuery] = useState('')

  return (
    <TabPage
      title="首页"
      subtitle="今天想听点什么呢？"
      trailing={
        <Avatar
          pressable
          size={44}
          src="https://avatars.githubusercontent.com/u/583231?v=4"
          alt="用户头像"
          ariaLabel="打开个人信息"
        />
      }
    >
      <>
        <ContentCard
          title="立刻开始收听！"
          actions={
            <Pressable variant="text" className="text-system-blue" type="button">
              知道啦！下次不再提醒
            </Pressable>
          }
        >
          <p className="text-[16px] leading-[1.35] text-foreground/92">
            从bilibili中将视频，收藏夹，或合集通过链接分享，然后将其复制在下面的输入框中。
          </p>

          <ActionInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索单曲，歌单，以及播放列表"
            actionAriaLabel="开始搜索"
          />
        </ContentCard>
        <ContentCard title="最近播放">
          <VideoListItem
            title="【早稻叽】连麦后的超强状态下播歌！《圆》+《Wonder..."
            uploader="单推叽叽的墨霖喵"
            duration="03:45"
          />
          <VideoListItem
            title="【早稻叽】连麦后的超强状态下播歌！《圆》+《Wonder..."
            uploader="单推叽叽的墨霖喵"
            duration="03:45"
          />
          <VideoListItem
            title="【早稻叽】连麦后的超强状态下播歌！《圆》+《Wonder..."
            uploader="单推叽叽的墨霖喵"
            duration="03:45"
          />
          <VideoListItem
            title="【早稻叽】连麦后的超强状态下播歌！《圆》+《Wonder..."
            uploader="单推叽叽的墨霖喵"
            duration="03:45"
          />
          <VideoListItem
            title="【早稻叽】连麦后的超强状态下播歌！《圆》+《Wonder..."
            uploader="单推叽叽的墨霖喵"
            duration="03:45"
          />
          <VideoListItem
            title="【早稻叽】连麦后的超强状态下播歌！《圆》+《Wonder..."
            uploader="单推叽叽的墨霖喵"
            duration="03:45"
          />
          <VideoListItem
            title="【早稻叽】连麦后的超强状态下播歌！《圆》+《Wonder..."
            uploader="单推叽叽的墨霖喵"
            duration="03:45"
          />
          <VideoListItem
            title="【早稻叽】连麦后的超强状态下播歌！《圆》+《Wonder..."
            uploader="单推叽叽的墨霖喵"
            duration="03:45"
          />
          <VideoListItem
            title="【早稻叽】连麦后的超强状态下播歌！《圆》+《Wonder..."
            uploader="单推叽叽的墨霖喵"
            duration="03:45"
          />
          <VideoListItem
            title="【早稻叽】连麦后的超强状态下播歌！《圆》+《Wonder..."
            uploader="单推叽叽的墨霖喵"
            duration="03:45"
          />
          <VideoListItem
            title="【早稻叽】连麦后的超强状态下播歌！《圆》+《Wonder..."
            uploader="单推叽叽的墨霖喵"
            duration="03:45"
          />

          <VideoListItem
            title="【早稻叽】连麦后的超强状态下播歌！《圆》+《Wonder..."
            uploader="单推叽叽的墨霖喵"
            duration="03:45"
          />
          <VideoListItem
            title="【早稻叽】连麦后的超强状态下播歌！《圆》+《Wonder..."
            uploader="单推叽叽的墨霖喵"
            duration="03:45"
          />
          <VideoListItem
            title="【早稻叽】连麦后的超强状态下播歌！《圆》+《Wonder..."
            uploader="单推叽叽的墨霖喵"
            duration="03:45"
          />
        </ContentCard>
      </>
    </TabPage>
  )
}