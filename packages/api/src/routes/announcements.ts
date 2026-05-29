import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { db } from '../db'
import { announcements, categories } from '../db/schema'
import { BadRequestError, NotFoundError } from '../lib/errors'
import { pageMeta, paginationQuery, resolvePagination } from '../lib/pagination'
import { ok } from '../lib/response'
import { idParam } from '../lib/schemas'

// REFERENCE: safe to delete — the worked vertical slice (SEED_SPEC §8).
// GET list (paginated, joined to category) / POST create / DELETE soft-delete.
const announcementsRoutes = new Elysia({ prefix: '/api/announcements' })
  .get(
    '/',
    ({ query }) => {
      const { limit, offset } = resolvePagination(query)
      const rows = db
        .select({
          id: announcements.id,
          title: announcements.title,
          body: announcements.body,
          categoryId: announcements.categoryId,
          categoryName: categories.name,
          createdAt: announcements.createdAt,
        })
        .from(announcements)
        .innerJoin(categories, eq(announcements.categoryId, categories.id))
        .where(isNull(announcements.deletedAt))
        .orderBy(desc(announcements.createdAt))
        .limit(limit)
        .offset(offset)
        .all()
      const totalRow = db
        .select({ c: sql<number>`count(*)` })
        .from(announcements)
        .where(isNull(announcements.deletedAt))
        .get()
      return ok(rows, pageMeta(totalRow?.c ?? 0, limit, offset))
    },
    { query: paginationQuery },
  )
  .post(
    '/',
    ({ body }) => {
      const cat = db.select().from(categories).where(eq(categories.id, body.categoryId)).get()
      if (!cat) throw new BadRequestError('Unknown categoryId')
      const created = db
        .insert(announcements)
        .values({ title: body.title, body: body.body, categoryId: body.categoryId })
        .returning()
        .get()
      return ok(created)
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1, maxLength: 200 }),
        body: t.String({ minLength: 1, maxLength: 5000 }),
        categoryId: t.Number(),
      }),
    },
  )
  .delete(
    '/:id',
    ({ params }) => {
      const updated = db
        .update(announcements)
        .set({ deletedAt: sql`(current_timestamp)` })
        .where(and(eq(announcements.id, params.id), isNull(announcements.deletedAt)))
        .returning()
        .get()
      if (!updated) throw new NotFoundError('Announcement not found')
      return ok({ id: updated.id, deleted: true })
    },
    { params: idParam },
  )

export default announcementsRoutes
