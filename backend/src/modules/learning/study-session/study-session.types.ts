import { z } from 'zod'

import {
    finishStudySessionSchema,
    startStudySessionSchema,
    studySessionFiltersSchema,
    updateStudySessionSchema,
} from './study-session.schema.js'

export type StartStudySessionInput = z.infer<typeof startStudySessionSchema>
export type FinishStudySessionInput = z.infer<typeof finishStudySessionSchema>
export type UpdateStudySessionInput = z.infer<typeof updateStudySessionSchema>
export type StudySessionFilters = z.infer<typeof studySessionFiltersSchema>