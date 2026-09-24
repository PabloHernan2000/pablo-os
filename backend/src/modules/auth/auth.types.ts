import { z } from 'zod'

import {
    loginSchema,
    registerSchema,
    refreshTokenSchema,
} from './auth.schema.js'

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>