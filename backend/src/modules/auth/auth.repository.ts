import type { Pool } from 'pg'

interface CreateUserInput {
    name: string
    email: string
    passwordHash: string
}

interface CreateRefreshTokenInput {
    userId: string
    tokenHash: string
    expiresAt: Date
}

export class AuthRepository {
    constructor(
        private readonly pool: Pool,
    ) { }

    async findUserByEmail(email: string) {
        const query = `
      SELECT
        id,
        name,
        email,
        password_hash AS "passwordHash",
        last_login_at AS "lastLoginAt",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
    `

        const result = await this.pool.query(
            query,
            [email],
        )

        return result.rows[0] ?? null
    }

    async findUserById(id: string) {
        const query = `
      SELECT
        id,
        name,
        email,
        last_login_at AS "lastLoginAt",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE id = $1
      LIMIT 1
    `

        const result = await this.pool.query(
            query,
            [id],
        )

        return result.rows[0] ?? null
    }

    async createUser(
        data: CreateUserInput,
    ) {
        const query = `
      INSERT INTO users (
        name,
        email,
        password_hash
      )
      VALUES (
        $1,
        $2,
        $3
      )
      RETURNING
        id,
        name,
        email,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

        const values = [
            data.name,
            data.email,
            data.passwordHash,
        ]

        const result = await this.pool.query(
            query,
            values,
        )

        return result.rows[0]
    }

    async updateLastLogin(userId: string) {
        const query = `
      UPDATE users
      SET
        last_login_at = NOW(),
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        last_login_at AS "lastLoginAt"
    `

        const result = await this.pool.query(
            query,
            [userId],
        )

        return result.rows[0] ?? null
    }

    async createRefreshToken(
        data: CreateRefreshTokenInput,
    ) {
        const query = `
      INSERT INTO refresh_tokens (
        user_id,
        token_hash,
        expires_at
      )
      VALUES (
        $1,
        $2,
        $3
      )
      RETURNING
        id,
        user_id AS "userId",
        expires_at AS "expiresAt",
        revoked_at AS "revokedAt",
        created_at AS "createdAt"
    `

        const values = [
            data.userId,
            data.tokenHash,
            data.expiresAt,
        ]

        const result = await this.pool.query(
            query,
            values,
        )

        return result.rows[0]
    }

    async findRefreshToken(
        tokenHash: string,
    ) {
        const query = `
      SELECT
        rt.id,
        rt.user_id AS "userId",
        rt.token_hash AS "tokenHash",
        rt.expires_at AS "expiresAt",
        rt.revoked_at AS "revokedAt",
        rt.created_at AS "createdAt"
      FROM refresh_tokens rt
      WHERE rt.token_hash = $1
      LIMIT 1
    `

        const result = await this.pool.query(
            query,
            [tokenHash],
        )

        return result.rows[0] ?? null
    }

    async revokeRefreshToken(
        tokenHash: string,
    ) {
        const query = `
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE
        token_hash = $1
        AND revoked_at IS NULL
      RETURNING
        id,
        user_id AS "userId",
        revoked_at AS "revokedAt"
    `

        const result = await this.pool.query(
            query,
            [tokenHash],
        )

        return result.rows[0] ?? null
    }

    async revokeAllUserRefreshTokens(
        userId: string,
    ) {
        const query = `
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE
        user_id = $1
        AND revoked_at IS NULL
    `

        const result = await this.pool.query(
            query,
            [userId],
        )

        return result.rowCount ?? 0
    }

    async deleteExpiredRefreshTokens() {
        const query = `
      DELETE FROM refresh_tokens
      WHERE expires_at < NOW()
    `

        const result =
            await this.pool.query(query)

        return result.rowCount ?? 0
    }
}