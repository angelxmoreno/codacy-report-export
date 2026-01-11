import { z } from 'zod';
import { PaginationParamsSchema, WithProviderSchema } from './CommonParamsSchema';

export const ListRepositoryPullRequestsParamsSchema = z.object({
    remoteOrganizationName: z.string().describe('Organization name on the Git provider'),
    repositoryName: z.string().describe('Repository name on the Git provider organization'),
    search: z.string().optional().describe('Filter the results searching by this string.'),
    includeNotAnalyzed: z.boolean().optional().describe("If true, also return pull requests that weren't analyzed"),
    ...PaginationParamsSchema.shape,
    ...WithProviderSchema.shape,
});

export type ListRepositoryPullRequestsParams = z.infer<typeof ListRepositoryPullRequestsParamsSchema>;
