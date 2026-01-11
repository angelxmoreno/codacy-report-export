import { z } from 'zod';
import { ProviderEnumSchema } from '../../enums/Provider';
import { createPaginatedSchema } from './PaginationSchema';

export const ApiOrganizationSchema = z.object({
    identifier: z.number(),
    remoteIdentifier: z.string(),
    name: z.string(),
    avatar: z.string(),
    created: z.string(),
    provider: ProviderEnumSchema,
    joinMode: z.string(),
    type: z.string(),
    joinStatus: z.string(),
    singleProviderLogin: z.boolean(),
    hasDastAccess: z.boolean(),
    hasScaEnabled: z.boolean(),
});

export const PaginatedApiOrganizationSchema = createPaginatedSchema(ApiOrganizationSchema);

export type ApiOrganization = z.infer<typeof ApiOrganizationSchema>;
export type PaginatedApiOrganization = z.infer<typeof PaginatedApiOrganizationSchema>;
