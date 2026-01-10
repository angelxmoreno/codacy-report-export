import { z } from 'zod';
import { WithProviderSchema } from './CommonParamsSchema';

export const GetRepositoryPullRequestParamsSchema = z
    .object({
        remoteOrganizationName: z.string().describe('Organization name on the Git provider'),
        repositoryName: z.string().describe('Repository name on the Git provider organization'),
        pullRequestNumber: z.number().int().describe('Pull request number'),
    })
    .merge(WithProviderSchema);

export type GetRepositoryPullRequestParams = z.infer<typeof GetRepositoryPullRequestParamsSchema>;
