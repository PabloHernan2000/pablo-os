import type { Request, Response } from 'express'

import { ProjectService } from './project.service.js'
import {
    createProjectSchema,
    projectIdParamsSchema,
    updateProjectSchema,
} from './project.schema.js'

export class ProjectController {
    constructor(
        private readonly projectService: ProjectService
    ) { }

    findAll = async (_req: Request, res: Response) => {
        const projects = await this.projectService.findAll();

        return res.status(200).json({
            success: true,
            data: projects
        });
    }

    findById = async (req: Request, res: Response) => {
        const { id } = projectIdParamsSchema.parse(req.params)

        const project = await this.projectService.findById(id)

        return res.status(200).json({
            success: true,
            data: project,
        })
    }

    create = async (req: Request, res: Response) => {
        const data = createProjectSchema.parse(req.body)

        const project = await this.projectService.create(data)

        return res.status(201).json({
            success: true,
            data: project,
        })
    }

    update = async (req: Request, res: Response) => {
        const { id } = projectIdParamsSchema.parse(req.params)

        const data = updateProjectSchema.parse(req.body)

        const project = await this.projectService.update(id, data)

        return res.status(200).json({
            success: true,
            data: project,
        })
    }

    delete = async (req: Request, res: Response) => {
        const { id } = projectIdParamsSchema.parse(req.params)

        const project = await this.projectService.delete(id)

        return res.status(200).json({
            success: true,
            data: project,
        })
    }
}
