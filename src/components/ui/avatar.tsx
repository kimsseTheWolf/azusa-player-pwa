import * as React from 'react'
import { User } from 'lucide-react'
import { Pressable, type PressableProps } from '@/components/ui/pressable'
import { cn } from '@/lib/utils'

type AvatarProps = {
  src?: string | null
  alt?: string
  size?: number
  className?: string
  pressable?: boolean
  onClick?: PressableProps['onClick']
  ariaLabel?: string
}

function resolveAvatarSrc(src?: string | null) {
  const raw = src?.trim()
  if (!raw) {
    return null
  }

  if (
    /^data:/i.test(raw) ||
    /^(https?:)?\/\//i.test(raw) ||
    /^blob:/i.test(raw) ||
    /^file:/i.test(raw) ||
    /^\//.test(raw)
  ) {
    return raw
  }

  if (/^[A-Za-z0-9+/=\s]+$/.test(raw) && raw.replace(/\s/g, '').length > 32) {
    return `data:image/png;base64,${raw.replace(/\s/g, '')}`
  }

  return null
}

function AvatarContent({ src, alt }: { src?: string | null; alt: string }) {
  const [imageError, setImageError] = React.useState(false)
  const resolvedSrc = resolveAvatarSrc(src)

  React.useEffect(() => {
    setImageError(false)
  }, [resolvedSrc])

  if (!resolvedSrc || imageError) {
    return (
      <span className="flex h-full w-full items-center justify-center bg-card text-foreground/72">
        <User className="h-[55%] w-[55%]" />
      </span>
    )
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setImageError(true)}
      loading="lazy"
      decoding="async"
    />
  )
}

export function Avatar({
  src,
  alt = 'User avatar',
  size = 48,
  className,
  pressable = false,
  onClick,
  ariaLabel,
}: AvatarProps) {
  const sharedClassName = cn('inline-flex shrink-0 overflow-hidden rounded-full', className)
  const sizeStyle = { width: `${size}px`, height: `${size}px` }

  if (pressable) {
    return (
      <Pressable
        type="button"
        variant="ghost"
        onClick={onClick}
        aria-label={ariaLabel ?? alt}
        className={cn(
          sharedClassName,
          'min-h-0 border-0 bg-transparent p-0 !shadow-none !backdrop-blur-none'
        )}
        style={sizeStyle}
      >
        <AvatarContent src={src} alt={alt} />
      </Pressable>
    )
  }

  return (
    <div className={sharedClassName} style={sizeStyle} aria-label={alt}>
      <AvatarContent src={src} alt={alt} />
    </div>
  )
}