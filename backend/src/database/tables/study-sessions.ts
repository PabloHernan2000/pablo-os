import {
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core'
import { learningTopics } from './learning-topics.js'

export const studyDifficultyEnum = pgEnum(
    'study_difficulty',
    [
        'easy',
        'medium',
        'hard',
    ],
)

export const studySessions = pgTable(
    'study_sessions',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        topicId: uuid('topic_id').notNull().references(() => learningTopics.id, {
            onDelete: 'cascade',
        }),
        startedAt: timestamp('started_at', {
            withTimezone: true,
            mode: 'date',
        }).notNull(),
        endedAt: timestamp('ended_at', {
            withTimezone: true,
            mode: 'date',
        }),
        durationMinutes: integer('duration_minutes'),
        notes: text('notes'),
        difficulty: studyDifficultyEnum('difficulty'),
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
        index('study_sessions_topic_id_idx').on(
            table.topicId,
        ),
        index('study_sessions_started_at_idx').on(
            table.startedAt,
        ),
    ],
)

export type StudySession = typeof studySessions.$inferSelect

export type NewStudySession = typeof studySessions.$inferInsert