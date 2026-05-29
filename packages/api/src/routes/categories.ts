import { asc } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { db } from '../db'
import { categories } from '../db/schema'
import { ok } from '../lib/response'

// REFERENCE: safe to delete — feeds the category <Select> in the create form.
const categoriesRoutes = new Elysia({ prefix: '/api/categories' }).get('/', () => {
  const rows = db.select().from(categories).orderBy(asc(categories.name)).all()
  return ok(rows)
})

export default categoriesRoutes
