import type { ReactNode } from 'react'

interface StatusBannerProps {
  tone: 'loading' | 'error' | 'empty'
  children: ReactNode
  action?: ReactNode
}

export default function StatusBanner({ tone, children, action }: StatusBannerProps) {
  return (
    <div className={`status status--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <p>{children}</p>
      {action}
    </div>
  )
}
