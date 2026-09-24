import { z } from 'zod'

import {
    createTaskSchema,
    taskFiltersSchema,
    updateTaskSchema,
} from './task.schema.js'

export type CreateTaskInput =
    z.infer<typeof createTaskSchema>

export type UpdateTaskInput =
    z.infer<typeof updateTaskSchema>

export type TaskFilters =
    z.infer<typeof taskFiltersSchema>

export type UpdateTaskRepositoryInput =
    UpdateTaskInput & {
        completedAt?: Date | null | undefined
    }