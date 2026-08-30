/**
 * Route constants live in their own leaf file so App.jsx can import them
 * without pulling the module's components and questionnaire JSON into the main
 * bundle — importing from index.js would defeat the lazy chunk.
 */
export const SURVEY_ROUTES = ['/student-survey-v1']
