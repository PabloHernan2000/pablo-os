import { z } from 'zod'

export const createLearningAreaSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede superar 100 caracteres'),

    description: z
        .string()
        .trim()
        .max(5000, 'La descripción es demasiado larga')
        .optional(),
})

export const updateLearningAreaSchema =
    createLearningAreaSchema
        .partial()
        .refine(
            (data) => Object.keys(data).length > 0,
            {
                message:
                    'Debes enviar al menos un campo para actualizar',
            },
        )

export const learningAreaIdParamsSchema = z.object({
    id: z
        .string()
        .uuid('El id del área de aprendizaje no es válido'),
})