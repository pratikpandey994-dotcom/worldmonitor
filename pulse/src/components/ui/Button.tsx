import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-none border px-4 py-2 text-sm font-medium transition-colors',
        variant === 'primary' && 'border-[var(--accent-blue)] bg-[var(--accent-blue)] text-[var(--bg-base)] hover:bg-[#74b3ff]',
        variant === 'secondary' && 'border-[var(--border-active)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--accent-blue)]',
        variant === 'ghost' && 'border-transparent bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
        className,
      )}
      {...props}
    />
  )
}
