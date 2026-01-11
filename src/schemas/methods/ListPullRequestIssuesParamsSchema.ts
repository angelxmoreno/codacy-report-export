import { z } from 'zod';
import { PaginationParamsSchema, WithProviderSchema } from './CommonParamsSchema';

export const ListPullRequestIssuesParamsSchema = z.object({
    remoteOrganizationName: z.string().describe('Organization name on the Git provider'),
    repositoryName: z.string().describe('Repository name on the Git provider organization'),
    pullRequestNumber: z.number().int().describe('Pull request number'),
    status: z.string().optional().describe('Issue status'),
    onlyPotential: z.boolean().optional().describe('If true, retrieves only potential issues'),
    ...PaginationParamsSchema.shape,
    ...WithProviderSchema.shape,
});

export type ListPullRequestIssuesParams = z.infer<typeof ListPullRequestIssuesParamsSchema>;
