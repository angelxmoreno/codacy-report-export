import type { z } from 'zod';
import { ApiRepositoryPullRequestSchema } from './ApiRepositoryPullRequestSchema';

/**
 * Response schema for the API endpoint that returns a single PR with analysis.
 * The API returns the pull request object directly, not wrapped in a data property.
 */
export const ApiPullRequestWithAnalysisSchema = ApiRepositoryPullRequestSchema;

export type ApiPullRequestWithAnalysis = z.infer<typeof ApiPullRequestWithAnalysisSchema>;
