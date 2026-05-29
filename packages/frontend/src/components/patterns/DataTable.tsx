import type { ReactNode } from 'react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export interface Column<T> {
  key: string
  header: ReactNode
  cell: (row: T) => ReactNode
  className?: string
}

// CRUD-page table that owns its loading / error / empty states (uses the
// feedback components, no ad-hoc spinners). Pair with PageHeader + FormDialog.
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  isLoading,
  error,
  onRetry,
  emptyTitle,
  emptyDescription,
}: {
  columns: Column<T>[]
  rows: T[] | undefined
  getRowKey: (row: T) => string | number
  isLoading?: boolean
  error?: unknown
  onRetry?: () => void
  emptyTitle?: string
  emptyDescription?: string
}) {
  if (isLoading) return <LoadingState />
  if (error)
    return (
      <ErrorState description={error instanceof Error ? error.message : undefined} onRetry={onRetry} />
    )
  if (!rows || rows.length === 0)
    return <EmptyState title={emptyTitle} description={emptyDescription} />

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key} className={c.className}>
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowKey(row)}>
              {columns.map((c) => (
                <TableCell key={c.key} className={c.className}>
                  {c.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
