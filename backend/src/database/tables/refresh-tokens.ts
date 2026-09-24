import {
    index,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const refreshTokens = pgTable(
    'refresh_tokens',
    {
        id: uuid('id')
            .primaryKey()
            .defaultRandom(),

        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),

        tokenHash: varchar('token_hash', {
            length: 64,
        })
            .notNull()
            .unique(),

        expiresAt: timestamp('expires_at', {
            withTimezone: true,
            mode: 'date',
        }).notNull(),

        revokedAt: timestamp('revoked_at', {
            withTimezone: true,
            mode: 'date',
        }),

        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'date',
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index('refresh_tokens_user_id_idx').on(
            table.userId,
        ),

        index('refresh_tokens_expires_at_idx').on(
            table.expiresAt,
        ),
    ],
)

export type RefreshToken = typeof refreshTokens.$inferSelect

export type NewRefreshToken = typeof refreshTokens.$inferInsert