import type {
    Request,
    Response,
} from 'express'

import { AppError } from '../../shared/errors/app-error.js'

import {
    createTaskSchema,
    taskFiltersSchema,
    taskIdParamsSchema,
    updateTaskSchema,
} from './task.schema.js'

import { TaskService } from './task.service.js'

export class TaskController {
    constructor(
        private readonly taskService: TaskService,
    ) { }

    findAll = async (
        req: Request,
        res: Response,
    ) => {
        const userId = this.getUserId(req)

        const filters =
            taskFiltersSchema.parse(
                req.query,
            )

        const tasks =
            await this.taskService.findAll(
                userId,
                filters,
            )

        return res.status(200).json({
            success: true,
            data: tasks,
        })
    }

    findById = async (
        req: Request,
        res: Response,
    ) => {
        const userId = this.getUserId(req)

        const { id } =
            taskIdParamsSchema.parse(
                req.params,
            )

        const task =
            await this.taskService.findById(
                id,
                userId,
            )

        return res.status(200).json({
            success: true,
            data: task,
        })
    }

    create = async (
        req: Request,
        res: Response,
    ) => {
        const userId = this.getUserId(req)

        const data =
            createTaskSchema.parse(
                req.body,
            )

        const task =
            await this.taskService.create(
                userId,
                data,
            )

        return res.status(201).json({
            success: true,
            data: task,
        })
    }

    update = async (
        req: Request,
        res: Response,
    ) => {
        const userId = this.getUserId(req)

        const { id } =
            taskIdParamsSchema.parse(
                req.params,
            )

        const data =
            updateTaskSchema.parse(
                req.body,
            )

        const task =
            await this.taskService.update(
                id,
                userId,
                data,
            )

        return res.status(200).json({
            success: true,
            data: task,
        })
    }

    complete = async (
        req: Request,
        res: Response,
    ) => {
        const userId = this.getUserId(req)

        const { id } =
            taskIdParamsSchema.parse(
                req.params,
            )

        const task =
            await this.taskService.complete(
                id,
                userId,
            )

        return res.status(200).json({
            success: true,
            data: task,
        })
    }

    reopen = async (
        req: Request,
        res: Response,
    ) => {
        const userId = this.getUserId(req)

        const { id } =
            taskIdParamsSchema.parse(
                req.params,
            )

        const task =
            await this.taskService.reopen(
                id,
                userId,
            )

        return res.status(200).json({
            success: true,
            data: task,
        })
    }

    delete = async (
        req: Request,
        res: Response,
    ) => {
        const userId = this.getUserId(req)

        const { id } =
            taskIdParamsSchema.parse(
                req.params,
            )

        const task =
            await this.taskService.delete(
                id,
                userId,
            )

        return res.status(200).json({
            success: true,
            data: task,
        })
    }

    private getUserId(
        req: Request,
    ): string {
        if (!req.userId) {
            throw new AppError(
                401,
                'UNAUTHORIZED',
                'No estás autenticado',
            )
        }

        return req.userId
    }
}