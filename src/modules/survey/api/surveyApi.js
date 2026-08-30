/**
 * The API the survey module talks to.
 *
 * Real HTTP by default. The in-browser mock is still here for demoing without a
 * backend (a college session on a flaky network, a design review on a laptop):
 *
 *   VITE_SURVEY_USE_MOCK=true npm run dev
 *
 * Both implementations export the same names with the same signatures, so
 * nothing above this file knows or cares which one is running.
 */

import * as httpApi from './httpSurveyApi'
import * as mockApi from './mockSurveyApi'

export const USE_MOCK = import.meta.env.VITE_SURVEY_USE_MOCK === 'true'

const impl = USE_MOCK ? mockApi : httpApi

export const requestOtp = impl.requestOtp
export const verifyOtp = impl.verifyOtp
export const verifySession = impl.verifySession
export const fetchSurvey = impl.fetchSurvey
export const saveDraft = impl.saveDraft
export const fetchDraft = impl.fetchDraft
export const submitSurvey = impl.submitSurvey
export const endSession = impl.endSession

export { ApiError } from './ApiError'
export { isValidEmail, isValidIndianMobile } from '../lib/validation'
