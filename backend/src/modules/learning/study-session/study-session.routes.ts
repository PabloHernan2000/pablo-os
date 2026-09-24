import { Router } from 'express'

import { pool } from '../../../database/index.js'

import { LearningTopicRepository } from '../topics/learning-topic.repository.js'
import { StudySessionController } from './study-session.controller.js'
import { StudySessionRepository } from './study-session.repository.js'
import { StudySessionService } from './study-session.service.js'

const studySessionRepository = new StudySessionRepository(pool)
const learningTopicRepository = new LearningTopicRepository(pool)
const studySessionService = new StudySessionService(
    studySessionRepository,
    learningTopicRepository,
)
const studySessionController = new StudySessionController(studySessionService,)

const studySessionRouter: Router = Router()

studySessionRouter.get(
    '/',
    studySessionController.findAll,
)

studySessionRouter.get(
    '/:id',
    studySessionController.findById,
)

studySessionRouter.post(
    '/start',
    studySessionController.start,
)

studySessionRouter.patch(
    '/:id/finish',
    studySessionController.finish,
)

studySessionRouter.patch(
    '/:id',
    studySessionController.update,
)

studySessionRouter.delete(
    '/:id',
    studySessionController.delete,
)

export {
    studySessionRouter,
}