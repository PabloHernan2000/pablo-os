import type {
    Request,
    Response,
} from 'express'

import { DashboardService } from './dashboard.service.js'

export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService,
    ) { }

    getDashboard = async (_req: Request, res: Response,) => {
        const dashboard = await this.dashboardService.getDashboard()

        return res.status(200).json({
            success: true,
            data: dashboard,
        })
    }
}