import { z } from 'zod';
import { PaginationParamsSchema, WithProviderSchema } from './CommonParamsSchema';

export const ListRepositoryBranchesParamsSchema = z.object({
    remoteOrganizationName: z.string().describe('Organization name on the Git provider'),
    repositoryName: z.string().describe('Repository name on the Git provider organization'),
    enabled: z.boolean().optional().describe('Returns only the enabled or disabled branches.'),
    search: z.string().optional().describe('Filter the results searching by this string.'),
    sort: z
        .enum(['name', 'last-updated'])
        .optional()
        .describe("Field used to sort the list of branches. The allowed values are 'name' and 'last-updated'."),
    direction: z
        .enum(['asc', 'desc'])
        .optional()
        .describe("Sort direction. Possible values are 'asc' (ascending) or 'desc' (descending)."),
    ...PaginationParamsSchema.shape,
    ...WithProviderSchema.shape,
});

export type ListRepositoryBranchesParams = z.infer<typeof ListRepositoryBranchesParamsSchema>;
