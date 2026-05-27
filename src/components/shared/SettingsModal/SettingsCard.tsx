import { cn } from "@/lib/utils"

interface SettingsCardProps {
  title: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function SettingsCard({ title, description, children, footer, action, className }: SettingsCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface p-4 flex flex-col gap-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-fg">{title}</p>
          {description && <p className="text-xs text-fg-3 mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      {children}
      {footer && <div className="flex items-center gap-2">{footer}</div>}
    </div>
  )
}
