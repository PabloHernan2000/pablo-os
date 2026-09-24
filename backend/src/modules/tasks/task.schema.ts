import { z } from 'zod'

export const taskStatusSchema = z.enum([
    'todo',
    'in_progress',
    'blocked',
    'done',
    'cancelled',
])

export const taskPrioritySchema = z.enum([
    'low',
    'medium',
    'high',
    'critical',
])

export const taskCategorySchema = z.enum([
    'personal',
    'project',
    'study',
    'work',
    'career',
    'health',
])

const dateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'La fecha debe tener formato YYYY-MM-DD',
    })

export const createTaskSchema = z.object({
    projectId: z.string().uuid().nullable().optional(),

    title: z
        .string()
        .trim()
        .min(2)
        .max(200),

    description: z
        .string()
        .trim()
        .max(5000)
        .optional(),

    status: taskStatusSchema
        .optional()
        .default('todo'),

    priority: taskPrioritySchema
        .optional()
        .default('medium'),

    category: taskCategorySchema
        .optional()
        .default('personal'),

    dueDate: dateSchema
        .nullable()
        .optional(),

    estimatedMinutes: z
        .number()
        .int()
        .positive()
        .nullable()
        .optional(),

    actualMinutes: z
        .number()
        .int()
        .nonnegative()
        .nullable()
        .optional(),
})

export const updateTaskSchema = createTaskSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: 'Debes enviar al menos un campo para actualizar',
        },
    )

export const taskIdParamsSchema = z.object({
    id: z.string().uuid(),
})

export const taskFiltersSchema = z.object({
    status: taskStatusSchema.optional(),

    priority: taskPrioritySchema.optional(),

    category: taskCategorySchema.optional(),

    projectId: z
        .string()
        .uuid()
        .optional(),

    due: z
        .enum(['today'])
        .optional(),
})