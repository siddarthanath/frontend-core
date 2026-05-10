interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {icon && <div className="text-4xl text-fg-3">{icon}</div>}
      <p className="font-semibold text-fg">{title}</p>
      {description && (
        <p className="text-sm max-w-sm text-fg-2">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
