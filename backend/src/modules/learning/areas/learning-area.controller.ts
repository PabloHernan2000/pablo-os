import type {
    Request,
    Response,
} from 'express'

import {
    createLearningAreaSchema,
    learningAreaIdParamsSchema,
    updateLearningAreaSchema,
} from './learning-area.schema.js'

import { LearningAreaService } from './learning-area.service.js'

export class LearningAreaController {
    constructor(
        private readonly learningAreaService: LearningAreaService,
    ) { }

    findAll = async (_req: Request, res: Response,) => {
        const areas = await this.learningAreaService.findAll()

        return res.status(200).json({
            success: true,
            data: areas,
        })
    }

    findById = async (req: Request, res: Response,) => {
        const { id } = learningAreaIdParamsSchema.parse(req.params,)

        const area = await this.learningAreaService.findById(id)

        return res.status(200).json({
            success: true,
            data: area,
        })
    }

    create = async (req: Request, res: Response,) => {
        const data = createLearningAreaSchema.parse(
            req.body,
        )

        const area = await this.learningAreaService.create(
            data,
        )

        return res.status(201).json({
            success: true,
            data: area,
        })
    }

    update = async (req: Request, res: Response,) => {
        const { id } = learningAreaIdParamsSchema.parse(
            req.params,
        )

        const data = updateLearningAreaSchema.parse(
            req.body,
        )

        const area = await this.learningAreaService.update(
            id,
            data,
        )

        return res.status(200).json({
            success: true,
            data: area,
        })
    }

    delete = async (req: Request, res: Response,) => {
        const { id } = learningAreaIdParamsSchema.parse(
            req.params,
        )

        const area = await this.learningAreaService.delete(id)

        return res.status(200).json({
            success: true,
            data: area,
        })
    }
}