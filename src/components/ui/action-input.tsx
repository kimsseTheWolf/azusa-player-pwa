import * as React from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type ActionInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> & {
  actionContent?: React.ReactNode
  onActionClick?: () => void
  hideActionButton?: boolean
  autoHideActionWhenEmpty?: boolean
  actionAriaLabel?: string
}

export function ActionInput({
  className,
  value,
  defaultValue,
  onChange,
  placeholder = '搜索单曲，歌单，以及播放列表',
  actionContent,
  onActionClick,
  hideActionButton = false,
  autoHideActionWhenEmpty = false,
  actionAriaLabel = '提交',
  ...props
}: ActionInputProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState(String(defaultValue ?? ''))

  const currentValue = isControlled ? String(value ?? '') : internalValue
  const isEmpty = currentValue.trim().length === 0

  const shouldHideAction = hideActionButton || (autoHideActionWhenEmpty && isEmpty)

  return (
    <div
      className={cn(
        'glass-surface flex w-full items-center gap-[5px] rounded-round !border-0 p-[5px]',
        className
      )}
    >
      <input
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => {
          if (!isControlled) {
            setInternalValue(event.target.value)
          }
          onChange?.(event)
        }}
        placeholder={placeholder}
        className="h-auto flex-1 bg-transparent py-[5px] pr-[5px] pl-[10px] text-[16px] leading-[1.25] text-foreground outline-none placeholder:text-[16px] placeholder:leading-[1.25] placeholder:text-[#898989]"
        {...props}
      />

      {!shouldHideAction ? (
        <button
          type="button"
          aria-label={actionAriaLabel}
          onClick={onActionClick}
          disabled={isEmpty}
          className="inline-flex h-[calc(1em+10px)] min-h-[30px] w-[calc(1em+10px)] min-w-[30px] shrink-0 items-center justify-center rounded-full bg-system-blue text-white transition-opacity disabled:opacity-45"
        >
          {actionContent ?? <ArrowRight className="h-[16px] w-[16px]" strokeWidth={2.4} />}
        </button>
      ) : null}
    </div>
  )
}