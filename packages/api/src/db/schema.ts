// REFERENCE-START
// The announcements + categories slice is the worked example (SEED_SPEC §8).
// `bun run eject:reference` removes everything between the REFERENCE markers.
import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
})

export const announcements = sqliteTable('announcements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  body: text('body').notNull(),
  // the relation: every announcement belongs to a category
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
  deletedAt: text('deleted_at'), // soft delete: hidden, not removed
})

export type Announcement = typeof announcements.$inferSelect
export type Category = typeof categories.$inferSelect
// REFERENCE-END

// Add your tables here. Example:
//   import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
//   export const widgets = sqliteTable('widgets', {
//     id: integer('id').primaryKey({ autoIncrement: true }),
//     name: text('name').notNull(),
//   })
export {}
