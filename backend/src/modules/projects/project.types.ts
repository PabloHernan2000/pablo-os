import { z } from 'zod'
import type { NewProject, Project } from '../../database/tables/projects.js'
import type { createProjectSchema, updateProjectSchema } from './project.schema.js'

export type CreateProjectInput =
    z.infer<typeof createProjectSchema>

export type UpdateProjectInput =
    z.infer<typeof updateProjectSchema>

export type { Project }