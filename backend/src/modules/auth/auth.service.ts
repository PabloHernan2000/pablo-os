import argon2 from 'argon2'

import {
    createHash,
    randomBytes,
} from 'node:crypto'

import { SignJWT } from 'jose'

import { AppError } from '../../shared/errors/app-error.js'

import { AuthRepository } from './auth.repository.js'

import type {
    LoginInput,
    RegisterInput,
} from './auth.types.js'

export class AuthService {
    private readonly accessTokenSecret: Uint8Array

    private readonly accessTokenExpiresIn: string

    private readonly refreshTokenDays: number

    constructor(
        private readonly authRepository: AuthRepository,
    ) {
        const jwtSecret =
            process.env.JWT_ACCESS_SECRET

        if (!jwtSecret) {
            throw new Error(
                'JWT_ACCESS_SECRET no está configurado',
            )
        }

        this.accessTokenSecret =
            new TextEncoder().encode(jwtSecret)

        this.accessTokenExpiresIn =
            process.env.JWT_ACCESS_EXPIRES_IN ??
            '15m'

        this.refreshTokenDays = Number(
            process.env.REFRESH_TOKEN_DAYS ?? 30,
        )
    }

    async register(
        data: RegisterInput,
    ) {
        const existingUser =
            await this.authRepository.findUserByEmail(
                data.email,
            )

        if (existingUser) {
            throw new AppError(
                409,
                'EMAIL_ALREADY_REGISTERED',
                'El correo electrónico ya está registrado',
            )
        }

        const passwordHash = await argon2.hash(
            data.password,
            {
                type: argon2.argon2id,
            },
        )

        const user =
            await this.authRepository.createUser({
                name: data.name,
                email: data.email,
                passwordHash,
            })

        const tokens =
            await this.createSession(user.id)

        return {
            user,
            ...tokens,
        }
    }

    async login(
        data: LoginInput,
    ) {
        const user =
            await this.authRepository.findUserByEmail(
                data.email,
            )

        if (!user) {
            throw new AppError(
                401,
                'INVALID_CREDENTIALS',
                'Correo electrónico o contraseña incorrectos',
            )
        }

        const passwordIsValid =
            await argon2.verify(
                user.passwordHash,
                data.password,
            )

        if (!passwordIsValid) {
            throw new AppError(
                401,
                'INVALID_CREDENTIALS',
                'Correo electrónico o contraseña incorrectos',
            )
        }

        await this.authRepository.updateLastLogin(
            user.id,
        )

        const tokens =
            await this.createSession(user.id)

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },

            ...tokens,
        }
    }

    async refresh(
        refreshToken: string,
    ) {
        const tokenHash =
            this.hashRefreshToken(refreshToken)

        const storedToken =
            await this.authRepository.findRefreshToken(
                tokenHash,
            )

        if (!storedToken) {
            throw new AppError(
                401,
                'INVALID_REFRESH_TOKEN',
                'El refresh token no es válido',
            )
        }

        if (storedToken.revokedAt) {
            await this.authRepository
                .revokeAllUserRefreshTokens(
                    storedToken.userId,
                )

            throw new AppError(
                401,
                'REFRESH_TOKEN_REUSED',
                'El refresh token ya fue utilizado o revocado',
            )
        }

        if (
            new Date(storedToken.expiresAt) <=
            new Date()
        ) {
            throw new AppError(
                401,
                'REFRESH_TOKEN_EXPIRED',
                'El refresh token ha expirado',
            )
        }

        const user =
            await this.authRepository.findUserById(
                storedToken.userId,
            )

        if (!user) {
            throw new AppError(
                401,
                'USER_NOT_FOUND',
                'El usuario asociado ya no existe',
            )
        }

        /*
         * Refresh token rotation:
         * el token actual deja de ser válido.
         */
        await this.authRepository
            .revokeRefreshToken(tokenHash)

        const tokens =
            await this.createSession(user.id)

        return {
            user,
            ...tokens,
        }
    }

    async logout(
        refreshToken: string,
    ) {
        const tokenHash =
            this.hashRefreshToken(refreshToken)

        await this.authRepository
            .revokeRefreshToken(tokenHash)

        return {
            message: 'Sesión cerrada correctamente',
        }
    }

    async logoutAll(
        userId: string,
    ) {
        await this.authRepository
            .revokeAllUserRefreshTokens(userId)

        return {
            message:
                'Se cerraron todas las sesiones correctamente',
        }
    }

    async getCurrentUser(
        userId: string,
    ) {
        const user =
            await this.authRepository.findUserById(
                userId,
            )

        if (!user) {
            throw new AppError(
                404,
                'USER_NOT_FOUND',
                'El usuario no existe',
            )
        }

        return user
    }

    private async createSession(
        userId: string,
    ) {
        const accessToken =
            await this.createAccessToken(userId)

        const refreshToken =
            this.generateRefreshToken()

        const tokenHash =
            this.hashRefreshToken(refreshToken)

        const expiresAt =
            this.calculateRefreshExpiration()

        await this.authRepository
            .createRefreshToken({
                userId,
                tokenHash,
                expiresAt,
            })

        return {
            accessToken,
            refreshToken,
            expiresIn: this.accessTokenExpiresIn,
        }
    }

    private async createAccessToken(
        userId: string,
    ) {
        return new SignJWT({
            sub: userId,
        })
            .setProtectedHeader({
                alg: 'HS256',
                typ: 'JWT',
            })
            .setIssuedAt()
            .setExpirationTime(
                this.accessTokenExpiresIn,
            )
            .sign(this.accessTokenSecret)
    }

    private generateRefreshToken() {
        return randomBytes(64)
            .toString('base64url')
    }

    private hashRefreshToken(
        refreshToken: string,
    ) {
        return createHash('sha256')
            .update(refreshToken)
            .digest('hex')
    }

    private calculateRefreshExpiration() {
        const expiresAt = new Date()

        expiresAt.setDate(
            expiresAt.getDate() +
            this.refreshTokenDays,
        )

        return expiresAt
    }
}