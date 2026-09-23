import { AppError } from "../../shared/errors/app-error.js";
import { ProjectRepository } from "./project.repository.js";

import type { CreateProjectInput, UpdateProjectInput } from './project.types.js';

export class ProjectService {
    constructor(
        private readonly projectRepository: ProjectRepository,
    ) { }

    private validateDates(
        startDate?: string | null,
        targetDate?: string | null,
    ) {
        if (!startDate || !targetDate) {
            return
        }

        if (targetDate < startDate) {
            throw new AppError(
                400,
                'INVALID_PROJECT_DATES',
                'La fecha objetivo no puede ser anterior a la fecha de inicio',
            )
        }
    }

    async findAll() {
        return await this.projectRepository.findAll();
    }

    async findById(id: string) {
        const project = await this.projectRepository.findbyId(id);

        if (!project) {
            throw new AppError(
                404,
                'PROJECT_NOT_FOUND',
                'El proyecto no existe'
            );
        }

        return project;
    }

    async create(data: CreateProjectInput) {
        this.validateDates(data.startDate, data.targetDate);

        return this.projectRepository.create(data);
    }

    async update(id: string, data: UpdateProjectInput) {
        const project = await this.projectRepository.findbyId(id);

        if (!project) {
            throw new AppError(
                404,
                'PROJECT_NOT_FOUND',
                'El proyecto no existe'
            );
        }

        const startDate = data.startDate ?? project.start_date;
        const targetDate = data.targetDate ?? project.target_date;

        this.validateDates(
            startDate,
            targetDate
        );

        const updateProject = await this.projectRepository.update(id, data);
    }
}