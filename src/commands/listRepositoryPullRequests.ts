import Table from 'cli-table3';
import type { Logger } from 'pino';
import { CodacyApiServiceFactory } from '../factories/CodacyApiServiceFactory';
import {
    type ListRepositoryPullRequestsParams,
    ListRepositoryPullRequestsParamsSchema,
} from '../schemas/methods/ListRepositoryPullRequestsParamsSchema';
import type { CodacyApiService } from '../services/CodacyApiService';
import type { SharedCommandParams } from '../types';
import { applyZodOptions } from '../utils/applyZodOptions';

export type ListRepositoryPullRequestsActionParams = {
    logger: Logger;
    params: ListRepositoryPullRequestsParams;
    service: CodacyApiService;
};
export type ListRepositoryPullRequestsActionReturn = Table.Table;

export const listRepositoryPullRequestsAction = async ({
    service,
    params,
}: ListRepositoryPullRequestsActionParams): Promise<ListRepositoryPullRequestsActionReturn> => {
    const options = ListRepositoryPullRequestsParamsSchema.parse(params);
    const results = await service.listRepositoryPullRequests(options);

    const table = new Table({
        head: ['ID', 'Number', 'Title', 'Status', 'Updated', 'Owner', 'Up to Standards', 'Analyzing'],
    });

    for (const pr of results.data) {
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
    }

    return table;
};

export function listRepositoryPullRequestsCommand({ program, logger }: SharedCommandParams) {
    const cmd = program.command('listRepositoryPullRequests');
    cmd.description('List pull requests for a repository');
    applyZodOptions(cmd, ListRepositoryPullRequestsParamsSchema);
    cmd.action(async (params) => {
        const service = CodacyApiServiceFactory({ logger });
        const table = await listRepositoryPullRequestsAction({ service, params, logger });
        console.log(table.toString());
    });
}
