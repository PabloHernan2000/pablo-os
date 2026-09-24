import type { Pool } from 'pg'

import type {
    CreateLearningTopicInput,
    LearningTopicFilters,
    UpdateLearningTopicInput,
} from './learning-topic.types.js'

const learningTopicSelect = `
  SELECT
    lt.id,
    lt.area_id AS "areaId",
    la.name AS "areaName",
    lt.name,
    lt.description,
    lt.status,
    lt.target_hours AS "targetHours",

    COALESCE(
      SUM(ss.duration_minutes),
      0
    )::int AS "studiedMinutes",

    lt.created_at AS "createdAt",
    lt.updated_at AS "updatedAt"

  FROM learning_topics lt

  INNER JOIN learning_areas la
    ON la.id = lt.area_id

  LEFT JOIN study_sessions ss
    ON ss.topic_id = lt.id
`

export class LearningTopicRepository {
    constructor(
        private readonly pool: Pool,
    ) { }

    async findAll(
        filters: LearningTopicFilters = {},
    ) {
        const conditions: string[] = []
        const values: unknown[] = []

        if (filters.areaId) {
            values.push(filters.areaId)

            conditions.push(
                `lt.area_id = $${values.length}`,
            )
        }

        if (filters.status) {
            values.push(filters.status)

            conditions.push(
                `lt.status = $${values.length}`,
            )
        }

        const where =
            conditions.length > 0
                ? `WHERE ${conditions.join(' AND ')}`
                : ''

        const query = `
      ${learningTopicSelect}

      ${where}

      GROUP BY
        lt.id,
        la.name

      ORDER BY
        la.name ASC,
        lt.name ASC
    `

        const result = await this.pool.query(
            query,
            values,
        )

        return result.rows
    }

    async findById(id: string) {
        const query = `
      ${learningTopicSelect}

      WHERE lt.id = $1

      GROUP BY
        lt.id,
        la.name

      LIMIT 1
    `

        const result = await this.pool.query(
            query,
            [id],
        )

        return result.rows[0] ?? null
    }

    async findByNameAndArea(
        name: string,
        areaId: string,
    ) {
        const query = `
      SELECT
        id,
        area_id AS "areaId",
        name
      FROM learning_topics
      WHERE
        area_id = $1
        AND LOWER(name) = LOWER($2)
      LIMIT 1
    `

        const result = await this.pool.query(
            query,
            [
                areaId,
                name,
            ],
        )

        return result.rows[0] ?? null
    }

    async create(
        data: CreateLearningTopicInput,
    ) {
        const query = `
      INSERT INTO learning_topics (
        area_id,
        name,
        description,
        status,
        target_hours
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      RETURNING
        id,
        area_id AS "areaId",
        name,
        description,
        status,
        target_hours AS "targetHours",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

        const values = [
            data.areaId,
            data.name,
            data.description ?? null,
            data.status,
            data.targetHours ?? null,
        ]

        const result = await this.pool.query(
            query,
            values,
        )

        return result.rows[0]
    }

    async update(
        id: string,
        data: UpdateLearningTopicInput,
    ) {
        const fields: string[] = []
        const values: unknown[] = []

        if (data.areaId !== undefined) {
            values.push(data.areaId)

            fields.push(
                `area_id = $${values.length}`,
            )
        }

        if (data.name !== undefined) {
            values.push(data.name)

            fields.push(
                `name = $${values.length}`,
            )
        }

        if (data.description !== undefined) {
            values.push(data.description)

            fields.push(
                `description = $${values.length}`,
            )
        }

        if (data.status !== undefined) {
            values.push(data.status)

            fields.push(
                `status = $${values.length}`,
            )
        }

        if (data.targetHours !== undefined) {
            values.push(data.targetHours)

            fields.push(
                `target_hours = $${values.length}`,
            )
        }

        fields.push(
            'updated_at = NOW()',
        )

        values.push(id)

        const query = `
      UPDATE learning_topics
      SET
        ${fields.join(', ')}
      WHERE id = $${values.length}
      RETURNING
        id,
        area_id AS "areaId",
        name,
        description,
        status,
        target_hours AS "targetHours",
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
      DELETE FROM learning_topics
      WHERE id = $1
      RETURNING
        id,
        area_id AS "areaId",
        name,
        description,
        status,
        target_hours AS "targetHours",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

        const result = await this.pool.query(
            query,
            [id],
        )

        return result.rows[0] ?? null
    }

    async countStudySessions(id: string) {
        const query = `
      SELECT
        COUNT(*)::int AS count
      FROM study_sessions
      WHERE topic_id = $1
    `

        const result = await this.pool.query(
            query,
            [id],
        )

        return result.rows[0]?.count ?? 0
    }
}