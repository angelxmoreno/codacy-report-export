import Table from 'cli-table3';
import type { Logger } from 'pino';
import { CodacyApiServiceFactory } from '../factories/CodacyApiServiceFactory';
import {
    type ListRepositoryBranchesParams,
    ListRepositoryBranchesParamsSchema,
} from '../schemas/methods/ListRepositoryBranchesParamsSchema';
import type { CodacyApiService } from '../services/CodacyApiService';
import type { SharedCommandParams } from '../types';
import { applyZodOptions } from '../utils/applyZodOptions';

export type ListRepositoryBranchesActionParams = {
    logger: Logger;
    params: ListRepositoryBranchesParams;
    service: CodacyApiService;
};
export type ListRepositoryBranchesActionReturn = Table.Table;

export const listRepositoryBranchesAction = async ({
    service,
    params,
}: ListRepositoryBranchesActionParams): Promise<ListRepositoryBranchesActionReturn> => {
    const options = ListRepositoryBranchesParamsSchema.parse(params);
    const results = await service.listRepositoryBranches(options);

    const table = new Table({
        head: ['ID', 'Name', 'Default', 'Enabled', 'Type', 'Last Updated', 'Last Commit'],
    });

    for (const branch of results.data) {
        table.push([
            branch.id,
            branch.name,
            branch.isDefault ? 'Yes' : 'No',
            branch.isEnabled ? 'Yes' : 'No',
            branch.branchType,
            branch.lastUpdated,
            branch.lastCommit,
        ]);
    }

    return table;
};

export function listRepositoryBranchesCommand({ program, logger }: SharedCommandParams) {
    const cmd = program.command('listRepositoryBranches');
    cmd.description('List branches for a repository');
    applyZodOptions(cmd, ListRepositoryBranchesParamsSchema);
    cmd.action(async (params) => {
        const service = CodacyApiServiceFactory({ logger });
        const table = await listRepositoryBranchesAction({ service, params, logger });
        console.log(table.toString());
    });
}
