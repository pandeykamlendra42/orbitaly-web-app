/**
 * Survey module — public surface.
 *
 * Everything the rest of the app is allowed to know about lives here. The
 * module owns its own data (data/*.json), transport (api/*) and rendering, so
 * lifting it into a package later is a directory move plus a package.json.
 */
export { default as SurveyPage } from './SurveyPage'
export { default as surveyDefinition } from './data/student-survey-v1.json'

/** Routes this module owns. App.jsx imports these from ./routes directly. */
export { SURVEY_ROUTES } from './routes'
