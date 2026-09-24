import { Router, type Request, type Response } from "express"
import { pool } from "../../database/index.js"

const healthCheck = async (
    _req: Request,
    res: Response,
) => {
    await pool.query('SELECT 1')

    return res.status(200).json({
        success: true,
        data: {
            status: 'ok',
            database: 'connected',
            timestamp: new Date().toISOString(),
        },
    })
}

const healthRoutes: Router = Router();

healthRoutes.get('/', healthCheck);

export {
    healthRoutes
}