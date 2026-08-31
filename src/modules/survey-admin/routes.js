/**
 * Route constants in a leaf file so App.jsx can import them without pulling the
 * dashboard into the main bundle — importing from index.js would defeat the
 * lazy chunk.
 */
export const SURVEY_ADMIN_ROUTES = ['/survey-analytics']
