type PlayerSheetProps = {
  open?: boolean
}

export function PlayerSheet({ open = false }: PlayerSheetProps) {
  if (!open) {
    return null
  }

  return (
    <section className="pointer-events-auto absolute inset-x-0 bottom-0 px-page-x pb-[max(16px,env(safe-area-inset-bottom))]">
      <div className="glass-surface rounded-t-[28px] p-card-gap">
        <p className="text-page-title tracking-[-0.02em] text-foreground">播放器面板</p>
        <p className="mt-1 text-page-subtitle text-foreground/68">后续由 MiniPlayer 点击展开。</p>
      </div>
    </section>
  )
}