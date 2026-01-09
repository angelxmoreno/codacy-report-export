import axios from 'axios';
import type { Logger } from 'pino';
import { CodacyApiService } from '../services/CodacyApiService';
import type { SharedCommandParams } from '../types';

export const testApiCall = async (logger: Logger) => {
    const service = new CodacyApiService({
        logger,
        apiToken: String(Bun.env.CODACY_ACCOUNT_TOKEN),
        httpClient: axios.create(),
    });

    const results = await service.getCurrentUser();
    logger.info(results);
};

export const registerTestApi = ({ program, logger }: SharedCommandParams) => {
    program
        .command('test')
        .description('tests api calls')
        .action(() => testApiCall(logger));
};
