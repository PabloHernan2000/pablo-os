import { Router } from 'express'

import { pool } from '../../../database/index.js'

import { LearningAreaController } from './learning-area.controller.js'
import { LearningAreaRepository } from './learning-area.repository.js'
import { LearningAreaService } from './learning-area.service.js'

const learningAreaRepository = new LearningAreaRepository(pool)
const learningAreaService = new LearningAreaService(learningAreaRepository,)
const learningAreaController = new LearningAreaController(learningAreaService,)
const learningAreaRouter: Router = Router()

learningAreaRouter.get(
    '/',
    learningAreaController.findAll,
)

learningAreaRouter.get(
    '/:id',
    learningAreaController.findById,
)

learningAreaRouter.post(
    '/',
    learningAreaController.create,
)

learningAreaRouter.patch(
    '/:id',
    learningAreaController.update,
)

learningAreaRouter.delete(
    '/:id',
    learningAreaController.delete,
)

export {
    learningAreaRouter,
}