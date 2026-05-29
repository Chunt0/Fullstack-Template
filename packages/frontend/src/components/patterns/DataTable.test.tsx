import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { type Column, DataTable } from './DataTable'

interface Row {
  id: number
  name: string
}
const columns: Column<Row>[] = [{ key: 'name', header: 'Name', cell: (r) => r.name }]

describe('DataTable', () => {
  it('shows the loading state', () => {
    render(<DataTable columns={columns} rows={undefined} getRowKey={(r) => r.id} isLoading />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows the empty state', () => {
    render(<DataTable columns={columns} rows={[]} getRowKey={(r) => r.id} emptyTitle="Nothing here" />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('shows the error state with retry', () => {
    render(
      <DataTable
        columns={columns}
        rows={undefined}
        getRowKey={(r) => r.id}
        error={new Error('boom')}
        onRetry={() => {}}
      />,
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('boom')).toBeInTheDocument()
  })

  it('renders rows', () => {
    render(<DataTable columns={columns} rows={[{ id: 1, name: 'Alice' }]} getRowKey={(r) => r.id} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })
})
