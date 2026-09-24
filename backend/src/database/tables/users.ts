import {
    index,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core'

export const users = pgTable(
    'users',
    {
        id: uuid('id')
            .primaryKey()
            .defaultRandom(),

        name: varchar('name', {
            length: 120,
        }).notNull(),

        email: varchar('email', {
            length: 254,
        })
            .notNull()
            .unique(),

        passwordHash: varchar('password_hash', {
            length: 255,
        }).notNull(),

        lastLoginAt: timestamp('last_login_at', {
            withTimezone: true,
            mode: 'date',
        }),

        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'date',
        })
            .notNull()
            .defaultNow(),

        updatedAt: timestamp('updated_at', {
            withTimezone: true,
            mode: 'date',
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index('users_email_idx').on(table.email),
    ],
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert