import type {
    Request,
    Response,
} from 'express'

import { AppError } from '../../shared/errors/app-error.js'

import {
    loginSchema,
    refreshTokenSchema,
    registerSchema,
} from './auth.schema.js'

import { AuthService } from './auth.service.js'

export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    register = async (req: Request, res: Response,) => {
        const data = registerSchema.parse(req.body,)

        const result = await this.authService.register(data)

        return res.status(201).json({
            success: true,
            data: result,
        })
    }

    login = async (req: Request, res: Response,) => {
        const data = loginSchema.parse(req.body,)

        const result = await this.authService.login(data)

        return res.status(200).json({
            success: true,
            data: result,
        })
    }

    refresh = async (req: Request, res: Response,) => {
        const { refreshToken } = refreshTokenSchema.parse(req.body)

        const result = await this.authService.refresh(refreshToken,)

        return res.status(200).json({
            success: true,
            data: result,
        })
    }

    logout = async (req: Request, res: Response,) => {
        const { refreshToken } = refreshTokenSchema.parse(req.body)

        const result = await this.authService.logout(
            refreshToken,
        )

        return res.status(200).json({
            success: true,
            data: result,
        })
    }

    logoutAll = async (req: Request, res: Response,) => {
        const userId = req.userId

        if (!userId) {
            throw new AppError(
                401,
                'UNAUTHORIZED',
                'No estás autenticado',
            )
        }

        const result = await this.authService.logoutAll(
            userId,
        )

        return res.status(200).json({
            success: true,
            data: result,
        })
    }

    me = async (req: Request, res: Response,) => {
        const userId = req.userId

        if (!userId) {
            throw new AppError(
                401,
                'UNAUTHORIZED',
                'No estás autenticado',
            )
        }

        const user = await this.authService.getCurrentUser(
            userId,
        )

        return res.status(200).json({
            success: true,
            data: user,
        })
    }
}