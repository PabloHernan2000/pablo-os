import { z } from 'zod'

import {
    createLearningTopicSchema,
    learningTopicFiltersSchema,
    updateLearningTopicSchema,
} from './learning-topic.schema.js'

export type CreateLearningTopicInput = z.infer<typeof createLearningTopicSchema>
export type UpdateLearningTopicInput = z.infer<typeof updateLearningTopicSchema>
export type LearningTopicFilters = z.infer<typeof learningTopicFiltersSchema>