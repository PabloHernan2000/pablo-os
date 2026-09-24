import { AppError } from '../../shared/errors/app-error.js'

import { ProjectRepository } from '../projects/project.repository.js'
import { TaskRepository } from './task.repository.js'

import type {
    CreateTaskInput,
    TaskFilters,
    UpdateTaskInput,
    UpdateTaskRepositoryInput,
} from './task.types.js'

export class TaskService {
    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly projectRepository: ProjectRepository,
    ) { }

    findAll(
        userId: string,
        filters: TaskFilters = {},
    ) {
        return this.taskRepository.findAll(
            userId,
            filters,
        )
    }

    async findById(
        id: string,
        userId: string,
    ) {
        const task =
            await this.taskRepository.findById(
                id,
                userId,
            )

        if (!task) {
            throw new AppError(
                404,
                'TASK_NOT_FOUND',
                'La tarea no existe',
            )
        }

        return task
    }

    async create(
        userId: string,
        data: CreateTaskInput,
    ) {
        if (data.projectId) {
            await this.validateProject(
                data.projectId,
                userId,
            )
        }

        return this.taskRepository.create(
            userId,
            data,
        )
    }

    async update(
        id: string,
        userId: string,
        data: UpdateTaskInput,
    ) {
        const task =
            await this.taskRepository.findById(
                id,
                userId,
            )

        if (!task) {
            throw new AppError(
                404,
                'TASK_NOT_FOUND',
                'La tarea no existe',
            )
        }

        if (
            data.projectId !== undefined &&
            data.projectId !== null
        ) {
            await this.validateProject(
                data.projectId,
                userId,
            )
        }

        const updateData: UpdateTaskRepositoryInput = {
            ...data,
        }

        /*
         * Si cambia a done, completamos
         * automáticamente la tarea.
         */
        if (
            data.status === 'done' &&
            task.status !== 'done'
        ) {
            updateData.completedAt = new Date()
        }

        /*
         * Si estaba terminada y cambia
         * a otro estado, quitamos completedAt.
         */
        if (
            data.status !== undefined &&
            data.status !== 'done' &&
            task.status === 'done'
        ) {
            updateData.completedAt = null
        }

        const updatedTask =
            await this.taskRepository.update(
                id,
                userId,
                updateData,
            )

        if (!updatedTask) {
            throw new AppError(
                404,
                'TASK_NOT_FOUND',
                'La tarea no existe',
            )
        }

        return updatedTask
    }

    async complete(
        id: string,
        userId: string,
    ) {
        const task =
            await this.taskRepository.findById(
                id,
                userId,
            )

        if (!task) {
            throw new AppError(
                404,
                'TASK_NOT_FOUND',
                'La tarea no existe',
            )
        }

        if (task.status === 'done') {
            return task
        }

        const updatedTask =
            await this.taskRepository.update(
                id,
                userId,
                {
                    status: 'done',
                    completedAt: new Date(),
                },
            )

        if (!updatedTask) {
            throw new AppError(
                404,
                'TASK_NOT_FOUND',
                'La tarea no existe',
            )
        }

        return updatedTask
    }

    async reopen(
        id: string,
        userId: string,
    ) {
        const task =
            await this.taskRepository.findById(
                id,
                userId,
            )

        if (!task) {
            throw new AppError(
                404,
                'TASK_NOT_FOUND',
                'La tarea no existe',
            )
        }

        const updatedTask =
            await this.taskRepository.update(
                id,
                userId,
                {
                    status: 'todo',
                    completedAt: null,
                },
            )

        if (!updatedTask) {
            throw new AppError(
                404,
                'TASK_NOT_FOUND',
                'La tarea no existe',
            )
        }

        return updatedTask
    }

    async delete(
        id: string,
        userId: string,
    ) {
        const task =
            await this.taskRepository.findById(
                id,
                userId,
            )

        if (!task) {
            throw new AppError(
                404,
                'TASK_NOT_FOUND',
                'La tarea no existe',
            )
        }

        const deletedTask =
            await this.taskRepository.delete(
                id,
                userId,
            )

        if (!deletedTask) {
            throw new AppError(
                404,
                'TASK_NOT_FOUND',
                'La tarea no existe',
            )
        }

        return deletedTask
    }

    private async validateProject(
        projectId: string,
        userId: string,
    ) {
        const project =
            await this.projectRepository.findById(
                projectId,
                userId,
            )

        if (!project) {
            throw new AppError(
                404,
                'PROJECT_NOT_FOUND',
                'El proyecto no existe',
            )
        }
    }
}