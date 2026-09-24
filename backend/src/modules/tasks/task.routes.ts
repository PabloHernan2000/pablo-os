import { Router } from 'express'

import { pool } from '../../database/index.js'

import { TaskController } from './task.controller.js'
import { TaskRepository } from './task.repository.js'
import { TaskService } from './task.service.js'
import { authMiddleware } from '../auth/auth.middleware.js'
import { ProjectRepository } from '../projects/project.repository.js'

const taskRepository = new TaskRepository(pool)
const projectRepository = new ProjectRepository(pool);
const taskService = new TaskService(taskRepository, projectRepository)
const taskController = new TaskController(taskService)
const taskRouter: Router = Router()

taskRouter.use(authMiddleware)

taskRouter.get(
    '/',
    taskController.findAll,
)

taskRouter.get(
    '/:id',
    taskController.findById,
)

taskRouter.post(
    '/',
    taskController.create,
)

taskRouter.patch(
    '/:id',
    taskController.update,
)

taskRouter.patch(
    '/:id/complete',
    taskController.complete,
)

taskRouter.patch(
    '/:id/reopen',
    taskController.reopen,
)

taskRouter.delete(
    '/:id',
    taskController.delete,
)

export { taskRouter }