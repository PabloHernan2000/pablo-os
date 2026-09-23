import type { NewProject, Project } from '../../database/tables/projects.js'

export type CreateProjectInput = Pick<NewProject, 'name' | 'description' | 'status' | 'repositoryUrl' | 'startDate' | 'targetDate'>

export type UpdateProjectInput = Partial<CreateProjectInput>

export type { Project }