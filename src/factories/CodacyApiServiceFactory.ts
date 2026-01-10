import axios from 'axios';
import { CodacyApiService } from '../services/CodacyApiService';
import type { CodacyApiServiceConfig } from '../types';
import { createLogger } from '../utils/createLogger';

export const CodacyApiServiceFactory = ({
    logger,
    httpClient,
    baseUrl,
}: Partial<Omit<CodacyApiServiceConfig, 'apiToken'>>): CodacyApiService => {
    const resolvedBaseUrl = baseUrl ?? 'https://api.codacy.com/api/v3';
    const token = Bun.env.CODACY_ACCOUNT_TOKEN?.trim();
    if (!token) {
        throw new Error('CODACY_ACCOUNT_TOKEN environment variable is required');
    }
    return new CodacyApiService({
        logger: logger ?? createLogger(),
        apiToken: token,
        httpClient: httpClient ?? axios.create(),
        baseUrl: resolvedBaseUrl,
    });
};
