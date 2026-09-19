import {
    date,
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core'
import { projects } from './projects.js'

export const taskStatusEnum = pgEnum('task_status', [
    'todo',
    'in_progress',
    'blocked',
    'done',
    'cancelled',
])

export const taskPriorityEnum = pgEnum('task_priority', [
    'low',
    'medium',
    'high',
    'critical',
])

export const taskCategoryEnum = pgEnum('task_category', [
    'personal',
    'project',
    'study',
    'work',
    'career',
    'health',
])

export const tasks = pgTable(
    'tasks',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        projectId: uuid('project_id').references(() => projects.id, {
            onDelete: 'set null',
        }),
        title: varchar('title', { length: 200, }).notNull(),
        description: text('description'),
        status: taskStatusEnum('status').notNull().default('todo'),
        priority: taskPriorityEnum('priority').notNull().default('medium'),
        category: taskCategoryEnum('category').notNull().default('personal'),
        dueDate: date('due_date'),
        estimatedMinutes: integer('estimated_minutes'),
        actualMinutes: integer('actual_minutes'),
        completedAt: timestamp('completed_at', {
            withTimezone: true,
            mode: 'date',
        }),
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
        index('tasks_project_id_idx').on(table.projectId),
        index('tasks_status_idx').on(table.status),
        index('tasks_priority_idx').on(table.priority),
        index('tasks_due_date_idx').on(table.dueDate),
    ],
)

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert