import { FileQuestion } from 'lucide-react'
import { Link } from 'react-router'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <EmptyState
      icon={FileQuestion}
      title="Page not found"
      description="That route doesn't exist."
      action={
        <Button asChild variant="outline">
          <Link to="/">Go home</Link>
        </Button>
      }
    />
  )
}
