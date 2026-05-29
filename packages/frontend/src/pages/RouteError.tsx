import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'

export function RouteError() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unexpected error'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <ErrorState title="Something went wrong" description={message} />
      <Button asChild variant="outline">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  )
}
