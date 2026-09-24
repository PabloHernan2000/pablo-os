import type {
    Request,
    Response,
} from 'express'

import {
    createLearningTopicSchema,
    learningTopicFiltersSchema,
    learningTopicIdParamsSchema,
    updateLearningTopicSchema,
} from './learning-topic.schema.js'

import { LearningTopicService } from './learning-topic.service.js'

export class LearningTopicController {
    constructor(
        private readonly learningTopicService: LearningTopicService,
    ) { }

    findAll = async (req: Request, res: Response,) => {
        const filters = learningTopicFiltersSchema.parse(
            req.query,
        )

        const topics = await this.learningTopicService.findAll(
            filters,
        )

        return res.status(200).json({
            success: true,
            data: topics,
        })
    }

    findById = async (req: Request, res: Response,) => {
        const { id } = learningTopicIdParamsSchema.parse(
            req.params,
        )

        const topic = await this.learningTopicService.findById(id)

        return res.status(200).json({
            success: true,
            data: topic,
        })
    }

    create = async (req: Request, res: Response,) => {
        const data = createLearningTopicSchema.parse(
            req.body,
        )

        const topic = await this.learningTopicService.create(
            data,
        )

        return res.status(201).json({
            success: true,
            data: topic,
        })
    }

    update = async (req: Request, res: Response,) => {
        const { id } = learningTopicIdParamsSchema.parse(
            req.params,
        )

        const data = updateLearningTopicSchema.parse(
            req.body,
        )

        const topic = await this.learningTopicService.update(
            id,
            data,
        )

        return res.status(200).json({
            success: true,
            data: topic,
        })
    }

    delete = async (req: Request, res: Response,) => {
        const { id } = learningTopicIdParamsSchema.parse(
            req.params,
        )

        const topic = await this.learningTopicService.delete(id)

        return res.status(200).json({
            success: true,
            data: topic,
        })
    }
}