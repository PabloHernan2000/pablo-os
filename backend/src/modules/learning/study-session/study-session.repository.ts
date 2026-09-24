import type { Pool } from 'pg'

import type {
    FinishStudySessionInput,
    StudySessionFilters,
    UpdateStudySessionInput,
} from './study-session.types.js'

const studySessionSelect = `
  SELECT
    ss.id,
    ss.topic_id AS "topicId",

    lt.name AS "topicName",

    ss.started_at AS "startedAt",
    ss.ended_at AS "endedAt",
    ss.duration_minutes AS "durationMinutes",

    ss.notes,
    ss.difficulty,

    ss.created_at AS "createdAt",
    ss.updated_at AS "updatedAt"

  FROM study_sessions ss

  INNER JOIN learning_topics lt
    ON lt.id = ss.topic_id
`

export class StudySessionRepository {
    constructor(
        private readonly pool: Pool,
    ) { }

    async findAll(
        filters: StudySessionFilters = {},
    ) {
        const conditions: string[] = []
        const values: unknown[] = []

        if (filters.topicId) {
            values.push(filters.topicId)

            conditions.push(
                `ss.topic_id = $${values.length}`,
            )
        }

        if (filters.difficulty) {
            values.push(filters.difficulty)

            conditions.push(
                `ss.difficulty = $${values.length}`,
            )
        }

        if (filters.status === 'active') {
            conditions.push(
                'ss.ended_at IS NULL',
            )
        }

        if (filters.status === 'finished') {
            conditions.push(
                'ss.ended_at IS NOT NULL',
            )
        }

        const where =
            conditions.length > 0
                ? `WHERE ${conditions.join(' AND ')}`
                : ''

        const query = `
      ${studySessionSelect}

      ${where}

      ORDER BY ss.started_at DESC
    `

        const result = await this.pool.query(
            query,
            values,
        )

        return result.rows
    }

    async findById(id: string) {
        const query = `
      ${studySessionSelect}

      WHERE ss.id = $1

      LIMIT 1
    `

        const result = await this.pool.query(
            query,
            [id],
        )

        return result.rows[0] ?? null
    }

    async findActiveSession() {
        const query = `
      ${studySessionSelect}

      WHERE ss.ended_at IS NULL

      ORDER BY ss.started_at DESC

      LIMIT 1
    `

        const result = await this.pool.query(query)

        return result.rows[0] ?? null
    }

    async create(topicId: string) {
        const query = `
      INSERT INTO study_sessions (
        topic_id,
        started_at
      )
      VALUES (
        $1,
        NOW()
      )
      RETURNING
        id,
        topic_id AS "topicId",
        started_at AS "startedAt",
        ended_at AS "endedAt",
        duration_minutes AS "durationMinutes",
        notes,
        difficulty,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

        const result = await this.pool.query(
            query,
            [topicId],
        )

        return result.rows[0]
    }

    async finish(
        id: string,
        data: FinishStudySessionInput,
    ) {
        const query = `
      UPDATE study_sessions
      SET
        ended_at = NOW(),

        duration_minutes = GREATEST(
          1,
          CEIL(
            EXTRACT(
              EPOCH FROM (NOW() - started_at)
            ) / 60
          )
        )::int,

        notes = $1,
        difficulty = $2,
        updated_at = NOW()

      WHERE
        id = $3
        AND ended_at IS NULL

      RETURNING
        id,
        topic_id AS "topicId",
        started_at AS "startedAt",
        ended_at AS "endedAt",
        duration_minutes AS "durationMinutes",
        notes,
        difficulty,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

        const values = [
            data.notes ?? null,
            data.difficulty ?? null,
            id,
        ]

        const result = await this.pool.query(
            query,
            values,
        )

        return result.rows[0] ?? null
    }

    async update(
        id: string,
        data: UpdateStudySessionInput,
    ) {
        const fields: string[] = []
        const values: unknown[] = []

        if (data.notes !== undefined) {
            values.push(data.notes)

            fields.push(
                `notes = $${values.length}`,
            )
        }

        if (data.difficulty !== undefined) {
            values.push(data.difficulty)

            fields.push(
                `difficulty = $${values.length}`,
            )
        }

        fields.push('updated_at = NOW()')

        values.push(id)

        const query = `
      UPDATE study_sessions
      SET
        ${fields.join(', ')}

      WHERE id = $${values.length}

      RETURNING
        id,
        topic_id AS "topicId",
        started_at AS "startedAt",
        ended_at AS "endedAt",
        duration_minutes AS "durationMinutes",
        notes,
        difficulty,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

        const result = await this.pool.query(
            query,
            values,
        )

        return result.rows[0] ?? null
    }

    async delete(id: string) {
        const query = `
      DELETE FROM study_sessions

      WHERE id = $1

      RETURNING
        id,
        topic_id AS "topicId",
        started_at AS "startedAt",
        ended_at AS "endedAt",
        duration_minutes AS "durationMinutes",
        notes,
        difficulty,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

        const result = await this.pool.query(
            query,
            [id],
        )

        return result.rows[0] ?? null
    }
}