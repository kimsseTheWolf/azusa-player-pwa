import { useState } from 'react'
import { MobilePage } from '@/components/layout/mobile-page'
import { ActionInput } from '@/components/ui/action-input'
import { ContentCard } from '@/components/ui/content-card'
import { VideoListItem } from '@/components/player/video-list-item'
import { Pressable } from '@/components/ui/pressable'
import { Avatar } from '@/components/ui/avatar'

export function HomePage() {
  const [query, setQuery] = useState('')

  return (
    <MobilePage
      title="首页"
      subtitle="今天想听点什么呢？"
      headerSlot={
        <Avatar
          pressable
          size={48}
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
            <Pressable
              variant="ghost"
              className="min-h-0 rounded-none border-0 bg-transparent px-0 py-0 text-[14px] font-semibold text-system-blue !shadow-none !backdrop-blur-none"
              type="button"
            >
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
    </MobilePage>
  )
}