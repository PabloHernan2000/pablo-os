import { z } from 'zod'

export const learningTopicStatusSchema = z.enum([
    'planned',
    'in_progress',
    'paused',
    'completed',
])

export const createLearningTopicSchema = z.object({
    areaId: z
        .string()
        .uuid('El areaId no es válido'),

    name: z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(120, 'El nombre no puede superar 120 caracteres'),

    description: z
        .string()
        .trim()
        .max(5000, 'La descripción es demasiado larga')
        .optional(),

    status: learningTopicStatusSchema
        .optional()
        .default('planned'),

    targetHours: z
        .number()
        .int()
        .positive('Las horas objetivo deben ser mayores a 0')
        .nullable()
        .optional(),
})

export const updateLearningTopicSchema =
    createLearningTopicSchema
        .omit({
            areaId: true,
        })
        .partial()
        .extend({
            areaId: z
                .string()
                .uuid('El areaId no es válido')
                .optional(),
        })
        .refine(
            (data) => Object.keys(data).length > 0,
            {
                message:
                    'Debes enviar al menos un campo para actualizar',
            },
        )

export const learningTopicIdParamsSchema = z.object({
    id: z
        .string()
        .uuid('El id del tema no es válido'),
})

export const learningTopicFiltersSchema = z.object({
    areaId: z
        .string()
        .uuid()
        .optional(),

    status: learningTopicStatusSchema
        .optional(),
})