import {
    index,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core'

export const learningAreas = pgTable(
    'learning_areas',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        name: varchar('name', { length: 100, }).notNull(),
        description: text('description'),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'date',
        }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', {
            withTimezone: true,
            mode: 'date',
        }).notNull().defaultNow(),
    },
    (table) => [
        index('learning_areas_name_idx').on(table.name),
    ],
)

export type LearningArea = typeof learningAreas.$inferSelect
export type NewLearningArea = typeof learningAreas.$inferInsert