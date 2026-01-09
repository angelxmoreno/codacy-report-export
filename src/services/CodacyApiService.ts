import { type AxiosInstance, type AxiosRequestConfig, isAxiosError } from 'axios';
import type { Logger } from 'pino';
import { CodacyApiServiceError } from '../errors/CodacyApiServiceError';
import type { ApiUser, ApiUserResponse } from '../schemas/api/ApiUserSchema';
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

    protected async request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
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
        try {
            const { data } = await this.httpClient.request<T>({
                ...requestConfig,
                headers: {
                    ...requestConfig.headers,
                    'api-token': this.apiToken,
                },
            });

            return data;
        } catch (error) {
            if (isAxiosError(error)) {
                this.logger.error(
                    {
                        status: error.status,
                        request: requestConfig,
                        responseData: error.response?.data,
                    },
                    'Error from Codacy API'
                );

                throw CodacyApiServiceError.fromAxiosError(error);
            }

            this.logger.error({ requestConfig, error }, 'Error calling Codacy API');
            throw new CodacyApiServiceError('Error calling Codacy API', {
                cause: error,
                status: 400,
            });
        }
    }
}
