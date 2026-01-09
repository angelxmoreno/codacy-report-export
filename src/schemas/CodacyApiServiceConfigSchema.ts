import type { AxiosInstance } from 'axios';
import type { Logger } from 'pino';
import { z } from 'zod';
import { isAxiosInstance } from '../utils/isAxiosInstance';
import { isPinoLogger } from '../utils/isPinoLogger';

export const CodacyApiServiceConfigSchema = z.object({
    httpClient: z.custom<AxiosInstance>(isAxiosInstance, {
        message: 'A valid Axios instance is required.',
    }),
    logger: z.custom<Logger>(isPinoLogger, {
        message: 'A valid Pino Logger instance is required.',
    }),
    apiToken: z.string(),
    baseUrl: z.url().default('https://api.codacy.com/api/v3').optional(),
});
