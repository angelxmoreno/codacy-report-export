import Table from 'cli-table3';
import type { Logger } from 'pino';
import { CodacyApiServiceFactory } from '../factories/CodacyApiServiceFactory';
import {
    type GetRepositoryPullRequestParams,
    GetRepositoryPullRequestParamsSchema,
} from '../schemas/methods/GetRepositoryPullRequestParamsSchema';
import type { CodacyApiService } from '../services/CodacyApiService';
import type { SharedCommandParams } from '../types';
import { applyZodOptions } from '../utils/applyZodOptions';

export type GetRepositoryPullRequestActionParams = {
    logger: Logger;
    params: GetRepositoryPullRequestParams;
    service: CodacyApiService;
};
export type GetRepositoryPullRequestActionReturn = Table.Table;

export const getRepositoryPullRequestAction = async ({
    service,
    params,
}: GetRepositoryPullRequestActionParams): Promise<GetRepositoryPullRequestActionReturn> => {
    const options = GetRepositoryPullRequestParamsSchema.parse(params);
    const pr = await service.getRepositoryPullRequest(options);

    const table = new Table({
        head: ['ID', 'Number', 'Title', 'Status', 'Updated', 'Owner', 'Up to Standards', 'Analyzing'],
    });

    table.push([
        pr.pullRequest.id,
        pr.pullRequest.number,
        pr.pullRequest.title,
        pr.pullRequest.status,
        pr.pullRequest.updated,
        pr.pullRequest.owner.name,
        pr.isUpToStandards ? 'Yes' : 'No',
        pr.isAnalysing ? 'Yes' : 'No',
    ]);

    return table;
};

export function getRepositoryPullRequestCommand({ program, logger }: SharedCommandParams) {
    const cmd = program.command('getRepositoryPullRequest');
    cmd.description('Get details of a specific pull request');
    applyZodOptions(cmd, GetRepositoryPullRequestParamsSchema);
    cmd.action(async (params) => {
        const service = CodacyApiServiceFactory({ logger });
        const table = await getRepositoryPullRequestAction({ service, params, logger });
        console.log(table.toString());
    });
}
