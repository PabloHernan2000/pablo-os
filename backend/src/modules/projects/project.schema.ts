import { z } from 'zod'

const projectStatusSchema = z.enum([
    'idea',
    'planning',
    'active',
    'paused',
    'completed',
    'archived',
]);

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener formato YYYY-MM-DD'
});

export const createProjectSchema = z.object({
    name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(120, 'El nombre no puede superar los 120 caracteres'),
    description: z.string().trim().max(5000, 'La descripción es demasiado larga').optional(),
    status: projectStatusSchema.optional().default('idea'),
    repositoryUrl: z.string().max(500).optional(),
    startDate: dateSchema.optional(),
    targetDate: dateSchema.optional(),
})

export const updateProjectSchema = createProjectSchema.partial().refine(
    (data) => Object.keys(data).length > 0, { message: 'Debes enviar al menos un campo para actualizar', },
)

export const projectIdParamsSchema = z.object({
    id: z.string().uuid('El id del proyecto no es válido'),
})