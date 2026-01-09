import { z } from 'zod';
import { PaginationParamsSchema, WithProviderSchema } from './CommonParamsSchema';

export const ListRepositoryBranchesParamsSchema = z.object({
    remoteOrganizationName: z.string(),
    repositoryName: z.string(),
    enabled: z.boolean().optional(),
    search: z.string().optional(),
    sort: z.enum(['name', 'last-updated']).optional(),
    direction: z.enum(['asc', 'desc']).optional(),
    ...PaginationParamsSchema.shape,
    ...WithProviderSchema.shape,
});

export type ListRepositoryBranchesParams = z.infer<typeof ListRepositoryBranchesParamsSchema>;
