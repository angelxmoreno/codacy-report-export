import { type AxiosInstance, type AxiosRequestConfig, isAxiosError } from 'axios';
import type { Logger } from 'pino';
import { ZodError, type z } from 'zod';
import { CodacyApiServiceError } from '../errors/CodacyApiServiceError';
import { type ApiUser, type ApiUserResponse, ApiUserResponseSchema } from '../schemas/api/ApiUserSchema';
import { CodacyApiServiceConfigSchema } from '../schemas/CodacyApiServiceConfigSchema';
import type { CodacyApiServiceConfig } from '../types';

export class CodacyApiService {
    protected baseUrl = 'https://api.codacy.com/api/v3';
    protected logger: Logger;
    protected httpClient: AxiosInstance;
    protected apiToken: string;

    constructor(config: CodacyApiServiceConfig) {
        const { logger, httpClient, apiToken } = CodacyApiServiceConfigSchema.parse(config);
        this.logger = logger;
        this.httpClient = httpClient;
        this.apiToken = apiToken;
    }

    protected async request<T = unknown>(config: AxiosRequestConfig, schema?: z.ZodType<T>): Promise<T> {
        const requestConfig: AxiosRequestConfig = {
            ...config,
            method: config.method ?? 'GET',
            baseURL: this.baseUrl,
            headers: {
                Accept: 'application/json',
                ...config.headers,
                'api-token': '<redacted>',
            },
        };
        this.logger.debug(requestConfig, 'Calling Codacy API');
        let responseBody: T | null = null;

        try {
            const { data } = await this.httpClient.request<T>({
                ...requestConfig,
                headers: {
                    ...requestConfig.headers,
                    'api-token': this.apiToken,
                },
            });
            responseBody = data;
            return schema ? schema.parse(responseBody) : responseBody;
        } catch (error) {
            let exception: CodacyApiServiceError;

            if (error instanceof ZodError) {
                exception = CodacyApiServiceError.fromZodError(error, requestConfig, responseBody);
            } else if (isAxiosError(error)) {
                exception = CodacyApiServiceError.fromAxiosError(error);
            } else {
                exception = new CodacyApiServiceError('Error calling Codacy API', {
                    cause: error,
                    status: 400,
                });
            }
            const { message, context } = exception.getLogData();
            this.logger.error(context, message);
            throw exception;
        }
    }

    async getCurrentUser(): Promise<ApiUser> {
        const { data } = await this.request<ApiUserResponse>(
            {
                url: '/user',
            },
            ApiUserResponseSchema
        );

        return data;
    }
}
