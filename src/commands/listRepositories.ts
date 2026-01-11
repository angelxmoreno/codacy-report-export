import Table from 'cli-table3';
import type { Logger } from 'pino';
import { CodacyApiServiceFactory } from '../factories/CodacyApiServiceFactory';
import {
    type ListRepositoriesParams,
    ListRepositoriesParamsSchema,
} from '../schemas/methods/ListRepositoriesParamsSchema';
import type { CodacyApiService } from '../services/CodacyApiService';
import type { SharedCommandParams } from '../types';
import { applyZodOptions } from '../utils/applyZodOptions';

export type ListRepositoriesActionParams = {
    logger: Logger;
    params: ListRepositoriesParams;
    service: CodacyApiService;
};
export type ListRepositoriesActionReturn = Table.Table;

export const listRepositoriesAction = async ({
    service,
    params,
}: ListRepositoriesActionParams): Promise<ListRepositoriesActionReturn> => {
    const options = ListRepositoriesParamsSchema.parse(params);
    const results = await service.listRepositories(options);

    const table = new Table({
        head: ['ID', 'Name', 'Visibility', 'Languages', 'Last Updated'],
    });

    for (const repo of results.data) {
        table.push([repo.repositoryId, repo.name, repo.visibility, repo.languages.join(', '), repo.lastUpdated]);
    }

    return table;
};

export function listRepositoriesCommand({ program, logger }: SharedCommandParams) {
    const cmd = program.command('listRepositories');
    cmd.description('List repositories for an organization');
    applyZodOptions(cmd, ListRepositoriesParamsSchema);
    cmd.action(async (params) => {
        const service = CodacyApiServiceFactory({ logger });
        const table = await listRepositoriesAction({ service, params, logger });
        console.log(table.toString());
    });
}
