/**
 * Survey analytics module — public surface.
 *
 * Internal-only dashboard over the read-only admin API. Depends on the survey
 * module for one thing: the bundled questionnaire, used to enumerate questions
 * and section titles (the admin API has no endpoint for those).
 */
export { default as AdminPage } from './AdminPage'
export { SURVEY_ADMIN_ROUTES } from './routes'
