import { AppError } from '../../../shared/errors/app-error.js'

import { LearningAreaRepository } from '../areas/learning-area.repository.js'
import { LearningTopicRepository } from './learning-topic.repository.js'

import type {
    CreateLearningTopicInput,
    LearningTopicFilters,
    UpdateLearningTopicInput,
} from './learning-topic.types.js'

export class LearningTopicService {
    constructor(
        private readonly learningTopicRepository: LearningTopicRepository,
        private readonly learningAreaRepository: LearningAreaRepository,
    ) { }

    async findAll(
        filters: LearningTopicFilters = {},
    ) {
        return this.learningTopicRepository.findAll(filters)
    }

    async findById(id: string) {
        const topic =
            await this.learningTopicRepository.findById(id)

        if (!topic) {
            throw new AppError(
                404,
                'LEARNING_TOPIC_NOT_FOUND',
                'El tema de aprendizaje no existe',
            )
        }

        return topic
    }

    async create(
        data: CreateLearningTopicInput,
    ) {
        const area =
            await this.learningAreaRepository.findById(
                data.areaId,
            )

        if (!area) {
            throw new AppError(
                404,
                'LEARNING_AREA_NOT_FOUND',
                'El área de aprendizaje no existe',
            )
        }

        const existingTopic =
            await this.learningTopicRepository.findByNameAndArea(
                data.name,
                data.areaId,
            )

        if (existingTopic) {
            throw new AppError(
                409,
                'LEARNING_TOPIC_ALREADY_EXISTS',
                'Ya existe un tema con ese nombre dentro del área',
            )
        }

        return this.learningTopicRepository.create(data)
    }

    async update(
        id: string,
        data: UpdateLearningTopicInput,
    ) {
        const currentTopic =
            await this.learningTopicRepository.findById(id)

        if (!currentTopic) {
            throw new AppError(
                404,
                'LEARNING_TOPIC_NOT_FOUND',
                'El tema de aprendizaje no existe',
            )
        }

        const areaId =
            data.areaId ?? currentTopic.areaId

        const name =
            data.name ?? currentTopic.name

        if (data.areaId !== undefined) {
            const area =
                await this.learningAreaRepository.findById(
                    data.areaId,
                )

            if (!area) {
                throw new AppError(
                    404,
                    'LEARNING_AREA_NOT_FOUND',
                    'El área de aprendizaje no existe',
                )
            }
        }

        if (
            data.name !== undefined ||
            data.areaId !== undefined
        ) {
            const existingTopic =
                await this.learningTopicRepository.findByNameAndArea(
                    name,
                    areaId,
                )

            if (
                existingTopic &&
                existingTopic.id !== id
            ) {
                throw new AppError(
                    409,
                    'LEARNING_TOPIC_ALREADY_EXISTS',
                    'Ya existe un tema con ese nombre dentro del área',
                )
            }
        }

        const updatedTopic =
            await this.learningTopicRepository.update(
                id,
                data,
            )

        if (!updatedTopic) {
            throw new AppError(
                404,
                'LEARNING_TOPIC_NOT_FOUND',
                'El tema de aprendizaje no existe',
            )
        }

        return updatedTopic
    }

    async delete(id: string) {
        const topic =
            await this.learningTopicRepository.findById(id)

        if (!topic) {
            throw new AppError(
                404,
                'LEARNING_TOPIC_NOT_FOUND',
                'El tema de aprendizaje no existe',
            )
        }

        const sessionsCount =
            await this.learningTopicRepository.countStudySessions(
                id,
            )

        if (sessionsCount > 0) {
            throw new AppError(
                409,
                'LEARNING_TOPIC_HAS_STUDY_SESSIONS',
                'No puedes eliminar el tema porque tiene sesiones de estudio asociadas',
            )
        }

        const deletedTopic =
            await this.learningTopicRepository.delete(id)

        if (!deletedTopic) {
            throw new AppError(
                404,
                'LEARNING_TOPIC_NOT_FOUND',
                'El tema de aprendizaje no existe',
            )
        }

        return deletedTopic
    }
}