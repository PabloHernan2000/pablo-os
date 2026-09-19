interface Enviroment {
    TRUST_PROXY: number;
    PORT: number;
    NODE_ENV: string;
    DATABASE_URL: string;
    FRONTEND_URL: string;
}

export const enviroment: Enviroment = {
    TRUST_PROXY: Number(process.env.TRUST_PROXY) ?? 0,
    PORT: Number(process.env.PORT) ?? 0,
    NODE_ENV: process.env.NODE_ENV ?? '',
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    FRONTEND_URL: process.env.FRONTEND_URL ?? '',
}
