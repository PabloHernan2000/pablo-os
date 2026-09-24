import { Router } from 'express'

import { pool } from '../../database/index.js'

import { DashboardController } from './dashboard.controller.js'
import { DashboardRepository } from './dashboard.repository.js'
import { DashboardService } from './dashboard.service.js'

const dashboardRepository = new DashboardRepository(pool)
const dashboardService = new DashboardService(dashboardRepository,)
const dashboardController = new DashboardController(dashboardService,)

const dashboardRouter: Router = Router()

dashboardRouter.get(
    '/',
    dashboardController.getDashboard,
)

export {
    dashboardRouter,
}