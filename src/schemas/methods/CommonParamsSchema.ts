import { z } from 'zod';
import { ProviderEnumSchema } from '../../enums/Provider';

export const WithProviderSchema = z.object({
    provider: ProviderEnumSchema,
});

export const PaginationParamsSchema = z.object({
    cursor: z.string().optional(),
    limit: z.number().int().optional(),
});
