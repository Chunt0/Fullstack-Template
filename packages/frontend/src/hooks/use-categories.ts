// REFERENCE: safe to delete — feeds the category <Select> in the create form.
import { useQuery } from '@tanstack/react-query'
import { api, unwrap } from '@/lib/api'

export interface Category {
  id: number
  name: string
  createdAt: string
}

export const categoryKeys = { all: ['categories'] as const }

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => unwrap<Category[]>(api.categories.get()),
  })
}
