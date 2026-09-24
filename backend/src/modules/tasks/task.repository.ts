import type { Pool } from 'pg'

import type {
    CreateTaskInput,
    TaskFilters,
    UpdateTaskInput,
    UpdateTaskRepositoryInput,
} from './task.types.js'

const taskSelect = `
  SELECT
    t.id,
    t.project_id AS "projectId",
    t.title,
    t.description,
    t.status,
    t.priority,
    t.category,
    t.due_date AS "dueDate",
    t.estimated_minutes AS "estimatedMinutes",
    t.actual_minutes AS "actualMinutes",
    t.completed_at AS "completedAt",
    t.created_at AS "createdAt",
    t.updated_at AS "updatedAt"
  FROM tasks t
`

export class TaskRepository {
    constructor(
        private readonly db: Pool,
    ) { }

    async findAll(
        userId: string,
        filters: TaskFilters = {},
    ) {
        const conditions: string[] = [
            't.user_id = $1',
        ]

        const values: unknown[] = [
            userId,
        ]

        if (filters.status) {
            values.push(filters.status)

            conditions.push(
                `t.status = $${values.length}`,
            )
        }

        if (filters.priority) {
            values.push(filters.priority)

            conditions.push(
                `t.priority = $${values.length}`,
            )
        }

        if (filters.category) {
            values.push(filters.category)

            conditions.push(
                `t.category = $${values.length}`,
            )
        }

        if (filters.projectId) {
            values.push(filters.projectId)

            conditions.push(
                `t.project_id = $${values.length}`,
            )
        }

        if (filters.due === 'today') {
            conditions.push(
                't.due_date = CURRENT_DATE',
            )
        }

        const query = `
      ${taskSelect}

      WHERE
        ${conditions.join(' AND ')}

      ORDER BY t.created_at DESC
    `

        const result = await this.db.query(
            query,
            values,
        )

        return result.rows
    }

    async findById(
        id: string,
        userId: string,
    ) {
        const query = `
      ${taskSelect}

      WHERE
        t.id = $1
        AND t.user_id = $2

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
        data: CreateTaskInput,
    ) {
        const query = `
      INSERT INTO tasks (
        user_id,
        project_id,
        title,
        description,
        status,
        priority,
        category,
        due_date,
        estimated_minutes,
        actual_minutes
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10
      )
      RETURNING
        id,
        project_id AS "projectId",
        title,
        description,
        status,
        priority,
        category,
        due_date AS "dueDate",
        estimated_minutes AS "estimatedMinutes",
        actual_minutes AS "actualMinutes",
        completed_at AS "completedAt",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

        const values = [
            userId,
            data.projectId ?? null,
            data.title,
            data.description ?? null,
            data.status,
            data.priority,
            data.category,
            data.dueDate ?? null,
            data.estimatedMinutes ?? null,
            data.actualMinutes ?? null,
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
        data: UpdateTaskRepositoryInput,
    ) {
        const fields: string[] = []
        const values: unknown[] = []

        if (data.projectId !== undefined) {
            values.push(data.projectId)

            fields.push(
                `project_id = $${values.length}`,
            )
        }

        if (data.title !== undefined) {
            values.push(data.title)

            fields.push(
                `title = $${values.length}`,
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

        if (data.priority !== undefined) {
            values.push(data.priority)

            fields.push(
                `priority = $${values.length}`,
            )
        }

        if (data.category !== undefined) {
            values.push(data.category)

            fields.push(
                `category = $${values.length}`,
            )
        }

        if (data.dueDate !== undefined) {
            values.push(data.dueDate)

            fields.push(
                `due_date = $${values.length}`,
            )
        }

        if (data.estimatedMinutes !== undefined) {
            values.push(data.estimatedMinutes)

            fields.push(
                `estimated_minutes = $${values.length}`,
            )
        }

        if (data.actualMinutes !== undefined) {
            values.push(data.actualMinutes)

            fields.push(
                `actual_minutes = $${values.length}`,
            )
        }

        if (data.completedAt !== undefined) {
            values.push(data.completedAt)

            fields.push(
                `completed_at = $${values.length}`,
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
      UPDATE tasks

      SET
        ${fields.join(', ')}

      WHERE
        id = $${idPosition}
        AND user_id = $${userIdPosition}

      RETURNING
        id,
        project_id AS "projectId",
        title,
        description,
        status,
        priority,
        category,
        due_date AS "dueDate",
        estimated_minutes AS "estimatedMinutes",
        actual_minutes AS "actualMinutes",
        completed_at AS "completedAt",
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
      DELETE FROM tasks

      WHERE
        id = $1
        AND user_id = $2

      RETURNING
        id,
        project_id AS "projectId",
        title,
        description,
        status,
        priority,
        category,
        due_date AS "dueDate",
        estimated_minutes AS "estimatedMinutes",
        actual_minutes AS "actualMinutes",
        completed_at AS "completedAt",
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