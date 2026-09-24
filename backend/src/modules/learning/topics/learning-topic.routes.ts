import { Router } from 'express'

import { pool } from '../../../database/index.js'

import { LearningAreaRepository } from '../areas/learning-area.repository.js'
import { LearningTopicController } from './learning-topic.controller.js'
import { LearningTopicRepository } from './learning-topic.repository.js'
import { LearningTopicService } from './learning-topic.service.js'

const learningTopicRepository = new LearningTopicRepository(pool)
const learningAreaRepository = new LearningAreaRepository(pool)
const learningTopicService = new LearningTopicService(
    learningTopicRepository,
    learningAreaRepository,
)
const learningTopicController = new LearningTopicController(learningTopicService,)

const learningTopicRouter: Router = Router()

learningTopicRouter.get(
    '/',
    learningTopicController.findAll,
)

learningTopicRouter.get(
    '/:id',
    learningTopicController.findById,
)

learningTopicRouter.post(
    '/',
    learningTopicController.create,
)

learningTopicRouter.patch(
    '/:id',
    learningTopicController.update,
)

learningTopicRouter.delete(
    '/:id',
    learningTopicController.delete,
)

export {
    learningTopicRouter,
}