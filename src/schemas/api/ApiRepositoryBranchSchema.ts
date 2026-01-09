import { z } from 'zod';
import { createPaginatedSchema } from './PaginationSchema';

export const ApiRepositoryBranchSchema = z.object({
    id: z.number(),
    name: z.string(),
    isDefault: z.boolean(),
    isEnabled: z.boolean(),
    branchType: z.string(),
    lastUpdated: z.iso.datetime(),
    lastCommit: z.string(),
});

export const PaginatedApiRepositoryBranchSchema = createPaginatedSchema(ApiRepositoryBranchSchema);

export type ApiRepositoryBranchS = z.infer<typeof ApiRepositoryBranchSchema>;
export type PaginatedApiRepositoryBranch = z.infer<typeof PaginatedApiRepositoryBranchSchema>;
