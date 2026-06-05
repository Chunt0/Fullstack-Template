// REFERENCE: safe to delete — TanStack Query hooks for the reference feature.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type Payload, unwrap } from '@/lib/api'

// Derived from the API response, not hand-written — if the route's projection
// changes (a renamed/dropped field), this type and its callers stop compiling.
export type Announcement = Payload<typeof api.announcements.get>[number]

// Typed query-key factory — call a function, never hand-format the key array.
export const announcementKeys = {
  all: ['announcements'] as const,
  list: (params?: { limit?: number }) => ['announcements', 'list', params ?? {}] as const,
}

export function useAnnouncements(params?: { limit?: number }) {
  return useQuery({
    queryKey: announcementKeys.list(params),
    queryFn: () =>
      unwrap(api.announcements.get({ query: { limit: params?.limit ?? 50 } })),
  })
}

export function useCreateAnnouncement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { title: string; body: string; categoryId: number }) =>
      unwrap(api.announcements.post(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: announcementKeys.all }),
  })
}

export function useDeleteAnnouncement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => unwrap(api.announcements({ id }).delete()),
    onSuccess: () => qc.invalidateQueries({ queryKey: announcementKeys.all }),
  })
}
