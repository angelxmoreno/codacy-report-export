import { z } from 'zod';
import { WithProviderSchema } from './CommonParamsSchema';

export const GetRepositoryPullRequestParamsSchema = z
    .object({
        remoteOrganizationName: z.string(),
        repositoryName: z.string(),
        pullRequestNumber: z.number().int(),
    })
    .merge(WithProviderSchema);

export type GetRepositoryPullRequestParams = z.infer<typeof GetRepositoryPullRequestParamsSchema>;
