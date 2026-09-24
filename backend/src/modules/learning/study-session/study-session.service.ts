import { AppError } from '../../../shared/errors/app-error.js'

import { LearningTopicRepository } from '../topics/learning-topic.repository.js'
import { StudySessionRepository } from './study-session.repository.js'

import type {
    FinishStudySessionInput,
    StudySessionFilters,
    UpdateStudySessionInput,
} from './study-session.types.js'

export class StudySessionService {
    constructor(
        private readonly studySessionRepository: StudySessionRepository,
        private readonly learningTopicRepository: LearningTopicRepository,
    ) { }

    async findAll(filters: StudySessionFilters = {}) {
        return this.studySessionRepository.findAll(filters)
    }

    async findById(id: string) {
        const session =
            await this.studySessionRepository.findById(id)

        if (!session) {
            throw new AppError(
                404,
                'STUDY_SESSION_NOT_FOUND',
                'La sesión de estudio no existe',
            )
        }

        return session
    }

    async start(topicId: string) {
        const topic =
            await this.learningTopicRepository.findById(
                topicId,
            )

        if (!topic) {
            throw new AppError(
                404,
                'LEARNING_TOPIC_NOT_FOUND',
                'El tema de aprendizaje no existe',
            )
        }

        const activeSession =
            await this.studySessionRepository.findActiveSession()

        if (activeSession) {
            throw new AppError(
                409,
                'STUDY_SESSION_ALREADY_ACTIVE',
                'Ya existe una sesión de estudio activa',
            )
        }

        return this.studySessionRepository.create(
            topicId,
        )
    }

    async finish(
        id: string,
        data: FinishStudySessionInput,
    ) {
        const session =
            await this.studySessionRepository.findById(
                id,
            )

        if (!session) {
            throw new AppError(
                404,
                'STUDY_SESSION_NOT_FOUND',
                'La sesión de estudio no existe',
            )
        }

        if (session.endedAt) {
            throw new AppError(
                409,
                'STUDY_SESSION_ALREADY_FINISHED',
                'La sesión de estudio ya fue finalizada',
            )
        }

        const finishedSession =
            await this.studySessionRepository.finish(
                id,
                data,
            )

        if (!finishedSession) {
            throw new AppError(
                409,
                'STUDY_SESSION_FINISH_FAILED',
                'No fue posible finalizar la sesión de estudio',
            )
        }

        return finishedSession
    }

    async update(
        id: string,
        data: UpdateStudySessionInput,
    ) {
        const session =
            await this.studySessionRepository.findById(
                id,
            )

        if (!session) {
            throw new AppError(
                404,
                'STUDY_SESSION_NOT_FOUND',
                'La sesión de estudio no existe',
            )
        }

        const updatedSession =
            await this.studySessionRepository.update(
                id,
                data,
            )

        if (!updatedSession) {
            throw new AppError(
                404,
                'STUDY_SESSION_NOT_FOUND',
                'La sesión de estudio no existe',
            )
        }

        return updatedSession
    }

    async delete(id: string) {
        const session =
            await this.studySessionRepository.findById(
                id,
            )

        if (!session) {
            throw new AppError(
                404,
                'STUDY_SESSION_NOT_FOUND',
                'La sesión de estudio no existe',
            )
        }

        if (!session.endedAt) {
            throw new AppError(
                409,
                'ACTIVE_STUDY_SESSION_CANNOT_BE_DELETED',
                'No puedes eliminar una sesión de estudio activa',
            )
        }

        const deletedSession =
            await this.studySessionRepository.delete(id)

        if (!deletedSession) {
            throw new AppError(
                404,
                'STUDY_SESSION_NOT_FOUND',
                'La sesión de estudio no existe',
            )
        }

        return deletedSession
    }
}