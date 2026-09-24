import type { Pool } from 'pg'

import type {
    CreateLearningAreaInput,
    UpdateLearningAreaInput,
} from './learning-area.types.js'

const learningAreaSelect = `
  SELECT
    id,
    name,
    description,
    created_at AS "createdAt",
    updated_at AS "updatedAt"
  FROM learning_areas
`

export class LearningAreaRepository {
    constructor(
        private readonly pool: Pool,
    ) { }

    async findAll() {
        const query = `
      ${learningAreaSelect}
      ORDER BY name ASC
    `

        const result = await this.pool.query(query)

        return result.rows
    }

    async findById(id: string) {
        const query = `
        ${learningAreaSelect}
        WHERE id = $1
        LIMIT 1
        `

        const result = await this.pool.query(
            query,
            [id],
        )

        return result.rows[0] ?? null
    }

    async findByName(name: string) {
        const query = `
        ${learningAreaSelect}
        WHERE LOWER(name) = LOWER($1)
        LIMIT 1
        `

        const result = await this.pool.query(
            query,
            [name],
        )

        return result.rows[0] ?? null
    }

    async create(
        data: CreateLearningAreaInput,
    ) {
        const query = `
      INSERT INTO learning_areas (
        name,
        description
      )
      VALUES (
        $1,
        $2
      )
      RETURNING
        id,
        name,
        description,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

        const values = [
            data.name,
            data.description ?? null,
        ]

        const result = await this.pool.query(
            query,
            values,
        )

        return result.rows[0]
    }

    async update(
        id: string,
        data: UpdateLearningAreaInput,
    ) {
        const fields: string[] = []
        const values: unknown[] = []

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

        fields.push('updated_at = NOW()')

        values.push(id)

        const query = `
      UPDATE learning_areas
      SET
        ${fields.join(', ')}
      WHERE id = $${values.length}
      RETURNING
        id,
        name,
        description,
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
      DELETE FROM learning_areas
      WHERE id = $1
      RETURNING
        id,
        name,
        description,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

        const result = await this.pool.query(
            query,
            [id],
        )

        return result.rows[0] ?? null
    }

    async countTopics(id: string) {
        const query = `
            SELECT COUNT(*)::int AS count
            FROM learning_topics
            WHERE area_id = $1
        `

        const result = await this.pool.query(
            query,
            [id],
        )

        return result.rows[0]?.count ?? 0
    }
}