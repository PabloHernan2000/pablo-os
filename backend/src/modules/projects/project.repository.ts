import type { Pool } from 'pg'

import type {
    CreateProjectInput,
    UpdateProjectInput,
} from './project.types.js'

export class ProjectRepository {
    constructor(
        private readonly db: Pool,
    ) { }

    async findAll(userId: string) {
        const query = `
      SELECT
        p.id,
        p.name,
        p.description,
        p.status,
        p.repository_url AS "repositoryUrl",
        p.start_date AS "startDate",
        p.target_date AS "targetDate",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",

        COUNT(t.id)::int AS "totalTasks",

        COUNT(t.id) FILTER (
          WHERE t.status = 'done'
        )::int AS "completedTasks",

        CASE
          WHEN COUNT(t.id) = 0 THEN 0
          ELSE ROUND(
            (
              COUNT(t.id) FILTER (
                WHERE t.status = 'done'
              )::numeric
              /
              COUNT(t.id)::numeric
            ) * 100
          )::int
        END AS "progress"

      FROM projects p

      LEFT JOIN tasks t
        ON t.project_id = p.id
        AND t.user_id = p.user_id

      WHERE p.user_id = $1

      GROUP BY p.id

      ORDER BY p.created_at DESC
    `

        const result = await this.db.query(
            query,
            [userId],
        )

        return result.rows
    }

    async findById(
        id: string,
        userId: string,
    ) {
        const query = `
      SELECT
        p.id,
        p.name,
        p.description,
        p.status,
        p.repository_url AS "repositoryUrl",
        p.start_date AS "startDate",
        p.target_date AS "targetDate",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",

        COUNT(t.id)::int AS "totalTasks",

        COUNT(t.id) FILTER (
          WHERE t.status = 'done'
        )::int AS "completedTasks",

        CASE
          WHEN COUNT(t.id) = 0 THEN 0
          ELSE ROUND(
            (
              COUNT(t.id) FILTER (
                WHERE t.status = 'done'
              )::numeric
              /
              COUNT(t.id)::numeric
            ) * 100
          )::int
        END AS "progress"

      FROM projects p

      LEFT JOIN tasks t
        ON t.project_id = p.id
        AND t.user_id = p.user_id

      WHERE
        p.id = $1
        AND p.user_id = $2

      GROUP BY p.id

      LIMIT 1
    `

        const result = await this.db.query(
            query,
            [
                id,
                userId,
            ],
        )

        return result.rows[0] ?? null
    }

    async create(
        userId: string,
        data: CreateProjectInput,
    ) {
        const query = `
      INSERT INTO projects (
        user_id,
        name,
        description,
        status,
        repository_url,
        start_date,
        target_date
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7
      )
      RETURNING
        id,
        name,
        description,
        status,
        repository_url AS "repositoryUrl",
        start_date AS "startDate",
        target_date AS "targetDate",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

        const values = [
            userId,
            data.name,
            data.description ?? null,
            data.status,
            data.repositoryUrl ?? null,
            data.startDate ?? null,
            data.targetDate ?? null,
        ]

        const result = await this.db.query(
            query,
            values,
        )

        return result.rows[0] ?? null
    }

    async update(
        id: string,
        userId: string,
        data: UpdateProjectInput,
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

        if (data.status !== undefined) {
            values.push(data.status)

            fields.push(
                `status = $${values.length}`,
            )
        }

        if (data.repositoryUrl !== undefined) {
            values.push(data.repositoryUrl)

            fields.push(
                `repository_url = $${values.length}`,
            )
        }

        if (data.startDate !== undefined) {
            values.push(data.startDate)

            fields.push(
                `start_date = $${values.length}`,
            )
        }

        if (data.targetDate !== undefined) {
            values.push(data.targetDate)

            fields.push(
                `target_date = $${values.length}`,
            )
        }

        fields.push(
            'updated_at = NOW()',
        )

        values.push(id)

        const idPosition = values.length

        values.push(userId)

        const userIdPosition = values.length

        const query = `
      UPDATE projects
      SET
        ${fields.join(', ')}

      WHERE
        id = $${idPosition}
        AND user_id = $${userIdPosition}

      RETURNING
        id,
        name,
        description,
        status,
        repository_url AS "repositoryUrl",
        start_date AS "startDate",
        target_date AS "targetDate",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

        const result = await this.db.query(
            query,
            values,
        )

        return result.rows[0] ?? null
    }

    async delete(
        id: string,
        userId: string,
    ) {
        const query = `
      DELETE FROM projects

      WHERE
        id = $1
        AND user_id = $2

      RETURNING
        id,
        name,
        description,
        status,
        repository_url AS "repositoryUrl",
        start_date AS "startDate",
        target_date AS "targetDate",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

        const result = await this.db.query(
            query,
            [
                id,
                userId,
            ],
        )

        return result.rows[0] ?? null
    }
}