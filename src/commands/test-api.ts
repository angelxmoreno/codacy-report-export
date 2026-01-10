import axios from 'axios';
import type { Logger } from 'pino';
import { Provider } from '../enums/Provider';
import type { CodacyApiServiceError } from '../errors/CodacyApiServiceError';
import { CodacyApiService } from '../services/CodacyApiService';
import type { SharedCommandParams } from '../types';

export const testApiCall = async (logger: Logger) => {
    const service = new CodacyApiService({
        logger,
        apiToken: String(Bun.env.CODACY_ACCOUNT_TOKEN),
        httpClient: axios.create(),
    });

    const orgsResponse = await service.listOrganizations({
        provider: Provider.GitHub,
    });
    const org = orgsResponse.data[0];
    if (!org) {
        logger.info(orgsResponse, 'no orgs found');
        return;
    }
    const reposResponse = await service.listRepositories({
        remoteOrganizationName: org.name,
        provider: org.provider,
    });
    const repo = reposResponse.data[0];
    if (!repo) {
        logger.info(reposResponse, 'no repos found');
        return;
    }

    const prsResponse = await service.listRepositoryPullRequests({
        provider: repo.provider,
        remoteOrganizationName: repo.owner,
        repositoryName: repo.name,
    });
    prsResponse.data.forEach((d) => {
        console.log(`pr# ${d.pullRequest.number}`);
    });
    const pr = prsResponse.data[0];
    if (!pr) {
        logger.info(prsResponse, 'no prs found');
        return;
    }
    try {
        const params = {
            provider: repo.provider,
            remoteOrganizationName: repo.owner,
            repositoryName: pr.pullRequest.repository,
            pullRequestNumber: 1,
        };
        const results = await service.listPullRequestIssues(params);
        logger.info({ results });
    } catch (e) {
        const error = e as CodacyApiServiceError;
        const { message, context } = error.getLogData();
        logger.error(
            {
                status: context.status,
                validationIssues: context.validationIssues,
            },
            message
        );
    }
};

export const registerTestApi = ({ program, logger }: SharedCommandParams) => {
    program
        .command('test')
        .description('tests api calls')
        .action(() => testApiCall(logger));
};
