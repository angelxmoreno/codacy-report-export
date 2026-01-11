import { z } from 'zod';
import { ProviderEnumSchema } from '../../enums/Provider';

export const WithProviderSchema = z.object({
    provider: ProviderEnumSchema.describe('Git provider'),
});

export const PaginationParamsSchema = z.object({
    cursor: z.string().optional().describe('Cursor to specify a batch of results to request'),
    limit: z.number().int().optional().describe('Maximum number of items to return'),
});
