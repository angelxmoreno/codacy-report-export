import { z } from 'zod';
import { PaginationParamsSchema, WithProviderSchema } from './CommonParamsSchema';

export const ListRepositoriesParamsSchema = z.object({
    remoteOrganizationName: z.string(),
    search: z.string().optional(),
    filter: z.string().optional(),
    languages: z.string().optional(),
    segments: z.string().optional(),
    ...PaginationParamsSchema.shape,
    ...WithProviderSchema.shape,
});

export type ListRepositoriesParams = z.infer<typeof ListRepositoriesParamsSchema>;
