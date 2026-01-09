import { z } from 'zod';
import { PaginationParamsSchema, WithProviderSchema } from './CommonParamsSchema';

export const ListPullRequestIssuesParamsSchema = z.object({
    remoteOrganizationName: z.string(),
    repositoryName: z.string(),
    pullRequestNumber: z.number().int(),
    status: z.string().optional(),
    onlyPotential: z.boolean().optional(),
    ...PaginationParamsSchema.shape,
    ...WithProviderSchema.shape,
});

export type ListPullRequestIssuesParams = z.infer<typeof ListPullRequestIssuesParamsSchema>;
