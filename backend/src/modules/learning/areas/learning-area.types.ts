import { z } from 'zod'

import {
    createLearningAreaSchema,
    updateLearningAreaSchema,
} from './learning-area.schema.js'

export type CreateLearningAreaInput = z.infer<typeof createLearningAreaSchema>

export type UpdateLearningAreaInput = z.infer<typeof updateLearningAreaSchema>