import type { Pool } from 'pg'

export class DashboardRepository {
    constructor(
        private readonly pool: Pool,
    ) { }

    async getTaskSummary() {
        const query = `
      SELECT
        COUNT(*) FILTER (
          WHERE status != 'done'
          AND status != 'cancelled'
        )::int AS "pendingTasks",

        COUNT(*) FILTER (
          WHERE status = 'done'
        )::int AS "completedTasks",

        COUNT(*) FILTER (
          WHERE priority IN ('high', 'critical')
          AND status != 'done'
          AND status != 'cancelled'
        )::int AS "highPriorityTasks",

        COUNT(*) FILTER (
          WHERE due_date = CURRENT_DATE
          AND status != 'done'
          AND status != 'cancelled'
        )::int AS "dueToday"
      FROM tasks
    `

        const result = await this.pool.query(query)

        return result.rows[0]
    }

    async getProjectSummary() {
        const query = `
      SELECT
        COUNT(*) FILTER (
          WHERE status = 'active'
        )::int AS "activeProjects",

        COUNT(*) FILTER (
          WHERE status = 'completed'
        )::int AS "completedProjects",

        COUNT(*) FILTER (
          WHERE status = 'paused'
        )::int AS "pausedProjects"
      FROM projects
    `

        const result = await this.pool.query(query)

        return result.rows[0]
    }

    async getLearningSummary() {
        const query = `
      SELECT
        COALESCE(
          SUM(duration_minutes),
          0
        )::int AS "totalStudyMinutes",

        COUNT(*) FILTER (
          WHERE ended_at IS NOT NULL
        )::int AS "totalSessions",

        COALESCE(
          SUM(duration_minutes) FILTER (
            WHERE started_at >= DATE_TRUNC(
              'week',
              CURRENT_DATE
            )
          ),
          0
        )::int AS "studyMinutesThisWeek",

        COUNT(*) FILTER (
          WHERE started_at >= DATE_TRUNC(
            'week',
            CURRENT_DATE
          )
          AND ended_at IS NOT NULL
        )::int AS "sessionsThisWeek"
      FROM study_sessions
    `

        const result = await this.pool.query(query)

        return result.rows[0]
    }

    async getRecentProjects() {
        const query = `
      SELECT
        p.id,
        p.name,
        p.status,

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

      WHERE p.status IN (
        'active',
        'planning'
      )

      GROUP BY p.id

      ORDER BY p.updated_at DESC

      LIMIT 5
    `

        const result = await this.pool.query(query)

        return result.rows
    }

    async getLearningTopics() {
        const query = `
      SELECT
        lt.id,
        lt.name,
        la.name AS "areaName",
        lt.target_hours AS "targetHours",

        COALESCE(
          SUM(ss.duration_minutes),
          0
        )::int AS "studiedMinutes"

      FROM learning_topics lt

      INNER JOIN learning_areas la
        ON la.id = lt.area_id

      LEFT JOIN study_sessions ss
        ON ss.topic_id = lt.id

      WHERE lt.status = 'in_progress'

      GROUP BY
        lt.id,
        la.name

      ORDER BY "studiedMinutes" DESC

      LIMIT 5
    `

        const result = await this.pool.query(query)

        return result.rows
    }
}