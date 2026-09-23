import 'dotenv/config';
import express, { type Application, type ErrorRequestHandler, type RequestHandler } from 'express';
import { enviroment } from './config/enviroment.js';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { projectRouter } from './modules/projects/project.routes.js';
import { errorHandler } from './middleware/error-handler.js';

/*
 * Convierte middlewares externos al tipo
 * RequestHandler utilizado por la versión
 * de Express instalada en el proyecto.
 */
const toExpressMiddleware = (
    middleware: unknown
): RequestHandler => {
    return middleware as RequestHandler;
};

export const createApp = (): Application => {
    const app: Application = express();

    app.disable('x-powered-by');

    app.set('trust proxy', enviroment.TRUST_PROXY);

    /*
     * Middlewares de seguridad.
     */
    app.use(
        helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" }
        })
    );

    app.use(compression());
    app.use(hpp());

    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        enviroment.FRONTEND_URL,
    ].filter((origin): origin is string => {
        return (typeof origin === 'string' && origin.trim() !== '');
    });

    const corsMiddleware = cors({
        origin: (requestOrigin, callback): void => {
            if (!requestOrigin) {
                callback(null, true);
                return;
            }

            if (allowedOrigins.includes(requestOrigin)) {
                callback(null, true);
                return;
            }

            callback(new Error('Not allowed by CORS'));
        },
        methods: [
            'GET',
            'POST',
            'PUT',
            'PATCH',
            'DELETE',
            'OPTIONS',
        ],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
        ],
        credentials: true,
    });

    app.use(toExpressMiddleware(corsMiddleware));

    app.use(express.json({ limit: '1mb', }));

    app.use(
        express.urlencoded({
            extended: true,
            limit: '1mb',
        })
    );

    app.use(toExpressMiddleware(cookieParser()));

    /*  
    * Routing
    */
    app.use('/api/projects', projectRouter)

    app.use(errorHandler)

    const notFoundHandler: RequestHandler = (_req, res): void => {
        res.status(404).json({
            status: 'error',
            msg: 'Ruta no encontrada',
        });
    };

    app.use(notFoundHandler);

    return app;
}