import { Router } from 'express'

import { pool } from '../../database/index.js'
import { authMiddleware } from '../auth/auth.middleware.js'

import { ProjectController } from './project.controller.js'
import { ProjectRepository } from './project.repository.js'
import { ProjectService } from './project.service.js'

const projectRepository =
    new ProjectRepository(pool)

const projectService =
    new ProjectService(projectRepository)

const projectController =
    new ProjectController(projectService)

const projectRouter: Router = Router()

projectRouter.use(authMiddleware)

projectRouter.get(
    '/',
    projectController.findAll,
)

projectRouter.get(
    '/:id',
    projectController.findById,
)

projectRouter.post(
    '/',
    projectController.create,
)

projectRouter.patch(
    '/:id',
    projectController.update,
)

projectRouter.delete(
    '/:id',
    projectController.delete,
)

export { projectRouter }