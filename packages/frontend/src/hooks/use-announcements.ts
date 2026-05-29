// REFERENCE: safe to delete — TanStack Query hooks for the reference feature.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, unwrap } from '@/lib/api'

export interface Announcement {
  id: number
  title: string
  body: string
  categoryId: number
  categoryName: string
  createdAt: string
}

// Typed query-key factory — call a function, never hand-format the key array.
export const announcementKeys = {
  all: ['announcements'] as const,
  list: (params?: { limit?: number }) => ['announcements', 'list', params ?? {}] as const,
}

export function useAnnouncements(params?: { limit?: number }) {
  return useQuery({
    queryKey: announcementKeys.list(params),
    queryFn: () =>
      unwrap<Announcement[]>(api.announcements.get({ query: { limit: params?.limit ?? 50 } })),
  })
}

export function useCreateAnnouncement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { title: string; body: string; categoryId: number }) =>
      unwrap<Announcement>(api.announcements.post(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: announcementKeys.all }),
  })
}

export function useDeleteAnnouncement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      unwrap<{ id: number; deleted: boolean }>(api.announcements({ id }).delete()),
    onSuccess: () => qc.invalidateQueries({ queryKey: announcementKeys.all }),
  })
}
