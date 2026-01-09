import { z } from 'zod';

export const ApiPaginationSchema = z.object({
    cursor: z.string().optional(),
    limit: z.number(),
    total: z.number().optional(),
});

export type ApiPagination = z.infer<typeof ApiPaginationSchema>;

export const createPaginatedSchema = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
    z.object({
        pagination: ApiPaginationSchema,
        data: z.array(schema),
    });
