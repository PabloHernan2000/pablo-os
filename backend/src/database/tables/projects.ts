import {
    date,
    index,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const projectStatusEnum = pgEnum('project_status', [
    'idea',
    'planning',
    'active',
    'paused',
    'completed',
    'archived',
])

export const projects = pgTable(
    'projects',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        name: varchar('name', { length: 120, }).notNull(),
        description: text('description'),
        status: projectStatusEnum('status').notNull().default('idea'),
        repositoryUrl: varchar('repository_url', { length: 500, }),
        startDate: date('start_date'),
        targetDate: date('target_date'),
        createdAt: timestamp('created_at', { withTimezone: true, mode: 'date', }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date', }).notNull().defaultNow(),
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),
    },
    (table) => [
        index('projects_status_idx').on(table.status),
        index('projects_target_date_idx').on(table.targetDate),
        index('projects_user_id_idx').on(table.userId),
    ],
)

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert