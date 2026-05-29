// REFERENCE: safe to delete — the worked CRUD page (PageHeader + DataTable +
// FormDialog + ConfirmDialog). Copy this shape for your own features.
import { Plus, Trash2 } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { ConfirmDialog } from '@/components/patterns/ConfirmDialog'
import { type Column, DataTable } from '@/components/patterns/DataTable'
import { FormDialog } from '@/components/patterns/FormDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/sonner'
import { Textarea } from '@/components/ui/textarea'
import {
  type Announcement,
  useAnnouncements,
  useCreateAnnouncement,
  useDeleteAnnouncement,
} from '@/hooks/use-announcements'
import { useCategories } from '@/hooks/use-categories'

export default function AnnouncementsPage() {
  const { data, isLoading, error, refetch } = useAnnouncements()
  const { data: categories } = useCategories()
  const create = useCreateAnnouncement()
  const remove = useDeleteAnnouncement()

  const [formOpen, setFormOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [toDelete, setToDelete] = useState<Announcement | null>(null)

  function resetForm() {
    setTitle('')
    setBody('')
    setCategoryId('')
  }

  function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!categoryId) {
      toast.error('Pick a category')
      return
    }
    create.mutate(
      { title, body, categoryId: Number(categoryId) },
      {
        onSuccess: () => {
          toast.success('Announcement created')
          setFormOpen(false)
          resetForm()
        },
        onError: (err) => toast.error(err.message),
      },
    )
  }

  function handleDelete() {
    if (!toDelete) return
    remove.mutate(toDelete.id, {
      onSuccess: () => {
        toast.success('Deleted')
        setToDelete(null)
      },
      onError: (err) => toast.error(err.message),
    })
  }

  const columns: Column<Announcement>[] = [
    { key: 'title', header: 'Title', cell: (r) => <span className="font-medium">{r.title}</span> },
    {
      key: 'category',
      header: 'Category',
      cell: (r) => <Badge variant="secondary">{r.categoryName}</Badge>,
    },
    {
      key: 'created',
      header: 'Created',
      cell: (r) => (
        <span className="text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12 text-right',
      cell: (r) => (
        <Button variant="ghost" size="icon" aria-label={`Delete ${r.title}`} onClick={() => setToDelete(r)}>
          <Trash2 />
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Reference feature — copy this CRUD shape, then run `bun run eject:reference`."
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus /> New
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={data}
        getRowKey={(r) => r.id}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        emptyTitle="No announcements"
        emptyDescription="Create your first one."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o)
          if (!o) resetForm()
        }}
        title="New announcement"
        description="Add a new announcement."
        onSubmit={handleCreate}
        submitLabel="Create"
        isSubmitting={create.isPending}
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="body">Body</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            maxLength={5000}
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FormDialog>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(o) => {
          if (!o) setToDelete(null)
        }}
        title="Delete announcement?"
        description={toDelete ? `"${toDelete.title}" will be removed.` : undefined}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        isConfirming={remove.isPending}
      />
    </div>
  )
}
