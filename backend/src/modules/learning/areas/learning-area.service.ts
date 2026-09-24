import { AppError } from '../../../shared/errors/app-error.js'

import { LearningAreaRepository } from './learning-area.repository.js'

import type {
    CreateLearningAreaInput,
    UpdateLearningAreaInput,
} from './learning-area.types.js'

export class LearningAreaService {
    constructor(
        private readonly learningAreaRepository: LearningAreaRepository,
    ) { }

    async findAll() {
        return this.learningAreaRepository.findAll()
    }

    async findById(id: string) {
        const area = await this.learningAreaRepository.findById(id)

        if (!area) {
            throw new AppError(
                404,
                'LEARNING_AREA_NOT_FOUND',
                'El área de aprendizaje no existe',
            )
        }

        return area
    }

    async create(data: CreateLearningAreaInput,) {
        const existingArea = await this.learningAreaRepository.findByName(
            data.name,
        )

        if (existingArea) {
            throw new AppError(
                409,
                'LEARNING_AREA_ALREADY_EXISTS',
                'Ya existe un área de aprendizaje con ese nombre',
            )
        }

        return this.learningAreaRepository.create(data)
    }

    async update(id: string, data: UpdateLearningAreaInput,) {
        const area = await this.learningAreaRepository.findById(id)

        if (!area) {
            throw new AppError(
                404,
                'LEARNING_AREA_NOT_FOUND',
                'El área de aprendizaje no existe',
            )
        }

        if (data.name !== undefined) {
            const existingArea = await this.learningAreaRepository.findByName(
                data.name,
            )

            if (
                existingArea &&
                existingArea.id !== id
            ) {
                throw new AppError(
                    409,
                    'LEARNING_AREA_ALREADY_EXISTS',
                    'Ya existe un área de aprendizaje con ese nombre',
                )
            }
        }

        const updatedArea = await this.learningAreaRepository.update(
            id,
            data,
        )

        if (!updatedArea) {
            throw new AppError(
                404,
                'LEARNING_AREA_NOT_FOUND',
                'El área de aprendizaje no existe',
            )
        }

        return updatedArea
    }

    async delete(id: string) {
        const area = await this.learningAreaRepository.findById(id)

        if (!area) {
            throw new AppError(
                404,
                'LEARNING_AREA_NOT_FOUND',
                'El área de aprendizaje no existe',
            )
        }

        const topicsCount = await this.learningAreaRepository.countTopics(id)

        if (topicsCount > 0) {
            throw new AppError(
                409,
                'LEARNING_AREA_HAS_TOPICS',
                'No puedes eliminar el área porque tiene temas asociados',
            )
        }

        const deletedArea = await this.learningAreaRepository.delete(id)

        if (!deletedArea) {
            throw new AppError(
                404,
                'LEARNING_AREA_NOT_FOUND',
                'El área de aprendizaje no existe',
            )
        }

        return deletedArea
    }
}