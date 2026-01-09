# Codacy API Service Notes

## Authentication

* v3 endpoints expect an account API token in the `api-token` header. Repository/project tokens only apply to legacy coverage uploads.
* Base URL defaults to `https://api.codacy.com/api/v3`, but on-prem/self-hosted deployments need this value to be configurable.

## Transport concerns

* Responses are JSON with optional cursor-based pagination (`pagination.cursor`); the service should expose a paginator helper.
* Rate limiting returns HTTP 503/504. Implement retry/backoff or surface structured errors so callers can react.
* Include `Accept: application/json` and redact the token in debug logs.

## Recommended Service Methods

1. **Token/identity**
   * `getCurrentUser()` and/or `getOrganizations(provider)` to validate the API token and list available org/provider pairs.

2. **Repository discovery**
   * `listRepositories(provider, organization, cursor?)` for `GET /organizations/{provider}/{organization}/repositories`.
   * `getRepositoryWithAnalysis(provider, organization, repo, branch?)` mirroring the doc example.

3. **Issue retrieval**
   * `searchRepositoryIssues(provider, organization, repo, filters)` wrapping `POST /organizations/.../repositories/.../issues/search`.
   * `getPullRequestIssues(provider, organization, repo, prNumber)` for PR-scoped issues (endpoint path from swagger).

4. **Pagination helper**
   * `paginate<T>(path, params)` that follows `pagination.cursor` until exhausted.

5. **Retry/Rate-limit handling**
   * Detect 503/504 responses and retry with exponential backoff or expose structured metadata so higher layers can throttle.

## Implementation Notes

* Constructor should accept `baseUrl`, `httpClient`, `logger`, and `apiToken`, with optional `timeout`, `retry`, and `userAgent`.
* Provide convenience methods for GET/POST (wrapping the generic `request`) to reduce boilerplate.
* Keep OpenAPI reference handy (`https://api.codacy.com/api/api-docs/swagger.yaml`) when modeling request/response types.
