import { z } from 'zod';
import { ProviderEnumSchema } from '../../enums/Provider';
import { createPaginatedSchema } from './PaginationSchema';

export const ApiRepositorySchema = z.object({
    provider: ProviderEnumSchema,
    owner: z.string(),
    name: z.string(),
    visibility: z.string(),
    problems: z.array(z.unknown()),
    languages: z.array(z.string()),
    standards: z.array(z.unknown()),
    addedState: z.string(),
    repositoryId: z.number(),
    remoteIdentifier: z.string(),
    lastUpdated: z.string(),
    gatePolicyId: z.number().optional(),
    gatePolicyName: z.string().optional(),
    fullPath: z.string().optional(),
    permission: z.string().optional(),
    defaultBranch: z
        .object({
            id: z.number(),
            name: z.string(),
            isDefault: z.boolean(),
            isEnabled: z.boolean(),
            lastUpdated: z.string(),
            branchType: z.string(),
            lastCommit: z.string(),
        })
        .optional(),
    badges: z.object({ grade: z.string(), coverage: z.string() }).optional(),
    codingStandardId: z.number().optional(),
    codingStandardName: z.string().optional(),
});

export const PaginatedApiRepositorySchema = createPaginatedSchema(ApiRepositorySchema);

export type ApiRepository = z.infer<typeof ApiRepositorySchema>;
export type PaginatedApiRepository = z.infer<typeof PaginatedApiRepositorySchema>;
