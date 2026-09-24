import type {
    NextFunction,
    Request,
    Response,
} from 'express'

import { jwtVerify } from 'jose'

import { AppError } from '../../shared/errors/app-error.js'
import { enviroment } from '../../config/enviroment.js'

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

const jwtSecret = enviroment.JWT_ACCESS_SECRET

if (!jwtSecret) {
    throw new Error(
        'JWT_ACCESS_SECRET no está configurado',
    )
}

const accessTokenSecret =
    new TextEncoder().encode(jwtSecret)

export const authMiddleware = async (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const authorization =
        req.headers.authorization

    if (!authorization) {
        throw new AppError(
            401,
            'AUTHORIZATION_REQUIRED',
            'Debes proporcionar un access token',
        )
    }

    const [scheme, token] =
        authorization.split(' ')

    if (
        scheme !== 'Bearer' ||
        !token
    ) {
        throw new AppError(
            401,
            'INVALID_AUTHORIZATION_HEADER',
            'El encabezado Authorization no es válido',
        )
    }

    try {
        const { payload } = await jwtVerify(
            token,
            accessTokenSecret,
            {
                algorithms: ['HS256'],
            },
        )

        if (
            !payload.sub ||
            typeof payload.sub !== 'string'
        ) {
            throw new AppError(
                401,
                'INVALID_ACCESS_TOKEN',
                'El access token no es válido',
            )
        }

        req.userId = payload.sub

        next()
    } catch (error) {
        if (error instanceof AppError) {
            throw error
        }

        throw new AppError(
            401,
            'INVALID_ACCESS_TOKEN',
            'El access token no es válido o ha expirado',
        )
    }
}