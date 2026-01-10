import { z } from 'zod';
import { PaginationParamsSchema, WithProviderSchema } from './CommonParamsSchema';

export const ListRepositoriesParamsSchema = z.object({
    remoteOrganizationName: z.string().describe('Organization name on the Git provider'),
    search: z.string().optional().describe('Filter the results searching by this string.'),
    filter: z.string().optional().describe('RepositoryFilter'),
    languages: z.string().optional().describe('Languages filter'),
    segments: z.string().optional().describe('Filter by a comma separated list of segment ids.'),
    ...PaginationParamsSchema.shape,
    ...WithProviderSchema.shape,
});

export type ListRepositoriesParams = z.infer<typeof ListRepositoriesParamsSchema>;
