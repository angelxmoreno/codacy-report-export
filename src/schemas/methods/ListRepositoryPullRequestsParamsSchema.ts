import { z } from 'zod';
import { PaginationParamsSchema, WithProviderSchema } from './CommonParamsSchema';

export const ListRepositoryPullRequestsParamsSchema = z.object({
    remoteOrganizationName: z.string(),
    repositoryName: z.string(),
    search: z.string().optional(),
    includeNotAnalyzed: z.boolean().optional(),
    ...PaginationParamsSchema.shape,
    ...WithProviderSchema.shape,
});

export type ListRepositoryPullRequestsParams = z.infer<typeof ListRepositoryPullRequestsParamsSchema>;
