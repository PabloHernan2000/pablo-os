import { Router } from 'express'

import { pool } from '../../database/index.js'

import { AuthController } from './auth.controller.js'
import { authMiddleware } from './auth.middleware.js'
import { AuthRepository } from './auth.repository.js'
import { AuthService } from './auth.service.js'

const authRepository = new AuthRepository(pool)
const authService = new AuthService(
    authRepository,
)
const authController = new AuthController(
    authService,
)

const authRouter: Router = Router()

authRouter.post(
    '/register',
    authController.register,
)

authRouter.post(
    '/login',
    authController.login,
)

authRouter.post(
    '/refresh',
    authController.refresh,
)

authRouter.post(
    '/logout',
    authController.logout,
)

authRouter.post(
    '/logout-all',
    authMiddleware,
    authController.logoutAll,
)

authRouter.get(
    '/me',
    authMiddleware,
    authController.me,
)

export {
    authRouter,
}