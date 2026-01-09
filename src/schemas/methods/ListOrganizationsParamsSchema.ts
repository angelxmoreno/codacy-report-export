import { z } from 'zod';
import { PaginationParamsSchema, WithProviderSchema } from './CommonParamsSchema';

export const ListOrganizationsParamsSchema = z.object({
    ...PaginationParamsSchema.shape,
    ...WithProviderSchema.shape,
});

export type ListOrganizationsParams = z.infer<typeof ListOrganizationsParamsSchema>;
