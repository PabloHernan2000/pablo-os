import { DashboardRepository } from './dashboard.repository.js'

export class DashboardService {
    constructor(
        private readonly dashboardRepository: DashboardRepository,
    ) { }

    async getDashboard() {
        const [
            tasks,
            projects,
            learning,
            recentProjects,
            learningTopics,
        ] = await Promise.all([
            this.dashboardRepository.getTaskSummary(),
            this.dashboardRepository.getProjectSummary(),
            this.dashboardRepository.getLearningSummary(),
            this.dashboardRepository.getRecentProjects(),
            this.dashboardRepository.getLearningTopics(),
        ])

        return {
            tasks,
            projects,
            learning,
            recentProjects,
            learningTopics,
        }
    }
}