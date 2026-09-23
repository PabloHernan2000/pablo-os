import type { ErrorRequestHandler, Response } from "express"
import { ZodError } from "zod"
import { AppError } from "../shared/errors/app-error.js"

export const errorHandler: ErrorRequestHandler = (error, _req, res: Response, _next) => {
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid request data',
                details: error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                })),
            },
        })
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            error: {
                code: error.code,
                message: error.message,
            },
        })
    }

    console.error(error)

    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
        },
    })
}