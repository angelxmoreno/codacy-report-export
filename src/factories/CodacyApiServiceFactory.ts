import axios from 'axios';
import { CodacyApiService } from '../services/CodacyApiService';
import type { CodacyApiServiceConfig } from '../types';
import { createLogger } from '../utils/createLogger';

export const CodacyApiServiceFactory = ({
    logger,
    httpClient,
    baseUrl,
}: Partial<Omit<CodacyApiServiceConfig, 'apiToken'>>): CodacyApiService => {
    return new CodacyApiService({
        logger: logger ?? createLogger(),
        apiToken: String(Bun.env.CODACY_ACCOUNT_TOKEN),
        httpClient: httpClient ?? axios.create(),
        baseUrl,
    });
};
