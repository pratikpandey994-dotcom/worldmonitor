import { X } from 'lucide-react'
import type { PropsWithChildren } from 'react'

interface ModalProps extends PropsWithChildren {
  title: string
  onClose: () => void
}

export function Modal({ children, title, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[rgba(8,10,15,0.82)] p-4 backdrop-blur-sm">
      <div className="mx-auto mt-10 w-full max-w-2xl border border-[var(--border-active)] bg-[var(--bg-elevated)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-[var(--font-editorial)] text-2xl text-[var(--text-primary)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
