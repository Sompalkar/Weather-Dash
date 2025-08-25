interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-surface-200 dark:bg-surface-700 rounded ${className}`}
    />
  )
}
