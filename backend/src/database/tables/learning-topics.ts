import {
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core'
import { learningAreas } from './learning-areas.js'

export const learningTopicStatusEnum = pgEnum(
    'learning_topic_status',
    [
        'planned',
        'in_progress',
        'paused',
        'completed',
    ],
)

export const learningTopics = pgTable(
    'learning_topics',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        areaId: uuid('area_id').notNull().references(() => learningAreas.id, {
            onDelete: 'cascade',
        }),
        name: varchar('name', { length: 120, }).notNull(),
        description: text('description'),
        status: learningTopicStatusEnum('status').notNull().default('planned'),
        targetHours: integer('target_hours'),
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
        index('learning_topics_area_id_idx').on(
            table.areaId,
        ),
        index('learning_topics_status_idx').on(
            table.status,
        ),
    ],
)

export type LearningTopic = typeof learningTopics.$inferSelect

export type NewLearningTopic = typeof learningTopics.$inferInsert