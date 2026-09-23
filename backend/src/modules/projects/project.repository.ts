import { Pool } from "pg";
import type { CreateProjectInput, UpdateProjectInput } from "./project.types.js";

export class ProjectRepository {
    constructor(
        private readonly db: Pool
    ) { }

    async findAll() {
        const query = `
        SELECT * FROM public.projects p
        ORDER BY p.created_at DESC;
        `;

        const result = await this.db.query(query);

        return result.rows ?? [];
    }

    async findbyId(id: string) {
        const query = `
        SELECT * FROM public.projects p
        WHERE p.id = $1
        LIMIT 1;
        `;

        const result = await this.db.query(query, [id]);

        return result.rows[0] ?? null;
    }

    async create(data: CreateProjectInput) {
        const { name, description, status, repositoryUrl, startDate, targetDate } = data;
        const query = `
        INSERT INTO public.projects (name, description, status, repository_url, start_date, target_date)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `;

        const result = await this.db.query(query, [name, description, status, repositoryUrl, startDate, targetDate]);

        return result.rows[0] ?? null;
    }

    async update(id: string, data: UpdateProjectInput) {
        const { name, description, status, repositoryUrl, startDate, targetDate } = data;
        const query = `
        UPDATE public.projects 
        SET
            name=$1, 
            description=$2, 
            status=$3, 
            repository_url=$4, 
            start_date=$5, 
            target_date=$6
        WHERE id = $7
        RETURNING *
        `;

        const result = await this.db.query(query, [name, description, status, repositoryUrl, startDate, targetDate, id]);

        return result.rows[0] ?? null;
    }

    async delete(id: string) {
        const query = `
        DELETE FROM public.projects
        WHERE id = $1
        RETURNING *
        `;

        const result = await this.db.query(query, [id]);

        return result ?? null;
    }

}