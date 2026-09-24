import { z } from 'zod'

export const studyDifficultySchema = z.enum([
  'easy',
  'medium',
  'hard',
])

export const startStudySessionSchema = z.object({
  topicId: z
    .string()
    .uuid('El topicId no es válido'),
})

export const finishStudySessionSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(10000, 'Las notas son demasiado largas')
    .optional(),

  difficulty: studyDifficultySchema.optional(),
})

export const updateStudySessionSchema = z
  .object({
    notes: z
      .string()
      .trim()
      .max(10000)
      .nullable()
      .optional(),

    difficulty: studyDifficultySchema
      .nullable()
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: 'Debes enviar al menos un campo',
    },
  )

export const studySessionIdParamsSchema = z.object({
  id: z
    .string()
    .uuid('El id de la sesión no es válido'),
})

export const studySessionFiltersSchema = z.object({
  topicId: z
    .string()
    .uuid()
    .optional(),

  difficulty: studyDifficultySchema.optional(),

  status: z
    .enum([
      'active',
      'finished',
    ])
    .optional(),
})