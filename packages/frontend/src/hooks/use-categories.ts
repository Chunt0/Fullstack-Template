// REFERENCE: safe to delete — feeds the category <Select> in the create form.
import { useQuery } from '@tanstack/react-query'
import { api, type Payload, unwrap } from '@/lib/api'

// Derived from the API response, not hand-written (see use-announcements.ts).
export type Category = Payload<typeof api.categories.get>[number]

export const categoryKeys = { all: ['categories'] as const }

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => unwrap(api.categories.get()),
  })
}
