import type {
    Request,
    Response,
} from 'express'

import {
    finishStudySessionSchema,
    startStudySessionSchema,
    studySessionFiltersSchema,
    studySessionIdParamsSchema,
    updateStudySessionSchema,
} from './study-session.schema.js'

import { StudySessionService } from './study-session.service.js'

export class StudySessionController {
    constructor(
        private readonly studySessionService: StudySessionService,
    ) { }

    findAll = async (req: Request, res: Response,) => {
        const filters = studySessionFiltersSchema.parse(
            req.query,
        )

        const sessions = await this.studySessionService.findAll(
            filters,
        )

        return res.status(200).json({
            success: true,
            data: sessions,
        })
    }

    findById = async (req: Request, res: Response,) => {
        const { id } = studySessionIdParamsSchema.parse(
            req.params,
        )

        const session = await this.studySessionService.findById(id)

        return res.status(200).json({
            success: true,
            data: session,
        })
    }

    start = async (req: Request, res: Response,) => {
        const { topicId } = startStudySessionSchema.parse(
            req.body,
        )

        const session = await this.studySessionService.start(
            topicId,
        )

        return res.status(201).json({
            success: true,
            data: session,
        })
    }

    finish = async (req: Request, res: Response,) => {
        const { id } = studySessionIdParamsSchema.parse(
            req.params,
        )

        const data = finishStudySessionSchema.parse(
            req.body,
        )

        const session = await this.studySessionService.finish(
            id,
            data,
        )

        return res.status(200).json({
            success: true,
            data: session,
        })
    }

    update = async (req: Request, res: Response,) => {
        const { id } = studySessionIdParamsSchema.parse(
            req.params,
        )

        const data = updateStudySessionSchema.parse(
            req.body,
        )

        const session = await this.studySessionService.update(
            id,
            data,
        )

        return res.status(200).json({
            success: true,
            data: session,
        })
    }

    delete = async (req: Request, res: Response,) => {
        const { id } = studySessionIdParamsSchema.parse(
            req.params,
        )

        const session = await this.studySessionService.delete(id)

        return res.status(200).json({
            success: true,
            data: session,
        })
    }
}