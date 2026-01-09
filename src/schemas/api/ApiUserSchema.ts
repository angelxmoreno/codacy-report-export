import { z } from 'zod';

/**
 * Schema for the user object returned by the Codacy API.
 */
export const ApiUserSchema = z.object({
    id: z.number(),
    name: z.string(),
    mainEmail: z.email(),
    otherEmails: z.array(z.email()),
    isAdmin: z.boolean(),
    isActive: z.boolean(),
    created: z.iso.datetime(),
    intercomHash: z.string(),
    zendeskHash: z.string(),
    shouldDoClientQualification: z.boolean().optional(),
});

/**
 * Schema for the full API response wrapping the user data.
 */
export const ApiUserResponseSchema = z.object({
    data: ApiUserSchema,
});

export type ApiUser = z.infer<typeof ApiUserSchema>;
export type ApiUserResponse = z.infer<typeof ApiUserResponseSchema>;
