import { AppError } from '../../shared/errors/app-error.js'

import { ProjectRepository } from './project.repository.js'

import type {
    CreateProjectInput,
    UpdateProjectInput,
} from './project.types.js'

export class ProjectService {
    constructor(
        private readonly projectRepository: ProjectRepository,
    ) { }

    private validateDates(
        startDate?: string | null,
        targetDate?: string | null,
    ) {
        if (!startDate || !targetDate) {
            return
        }

        if (targetDate < startDate) {
            throw new AppError(
                400,
                'INVALID_PROJECT_DATES',
                'La fecha objetivo no puede ser anterior a la fecha de inicio',
            )
        }
    }

    findAll(userId: string) {
        return this.projectRepository.findAll(userId)
    }

    async findById(
        id: string,
        userId: string,
    ) {
        const project =
            await this.projectRepository.findById(
                id,
                userId,
            )

        if (!project) {
            throw new AppError(
                404,
                'PROJECT_NOT_FOUND',
                'El proyecto no existe',
            )
        }

        return project
    }

    async create(
        userId: string,
        data: CreateProjectInput,
    ) {
        this.validateDates(
            data.startDate,
            data.targetDate,
        )

        return this.projectRepository.create(
            userId,
            data,
        )
    }

    async update(
        id: string,
        userId: string,
        data: UpdateProjectInput,
    ) {
        const project =
            await this.projectRepository.findById(
                id,
                userId,
            )

        if (!project) {
            throw new AppError(
                404,
                'PROJECT_NOT_FOUND',
                'El proyecto no existe',
            )
        }

        const startDate =
            data.startDate ?? project.startDate

        const targetDate =
            data.targetDate ?? project.targetDate

        this.validateDates(
            startDate,
            targetDate,
        )

        const updatedProject =
            await this.projectRepository.update(
                id,
                userId,
                data,
            )

        if (!updatedProject) {
            throw new AppError(
                404,
                'PROJECT_NOT_FOUND',
                'El proyecto no existe',
            )
        }

        return updatedProject
    }

    async delete(
        id: string,
        userId: string,
    ) {
        const project =
            await this.projectRepository.findById(
                id,
                userId,
            )

        if (!project) {
            throw new AppError(
                404,
                'PROJECT_NOT_FOUND',
                'El proyecto no existe',
            )
        }

        const deletedProject =
            await this.projectRepository.delete(
                id,
                userId,
            )

        if (!deletedProject) {
            throw new AppError(
                404,
                'PROJECT_NOT_FOUND',
                'El proyecto no existe',
            )
        }

        return deletedProject
    }
}