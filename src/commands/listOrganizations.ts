import Table from 'cli-table3';
import type { Logger } from 'pino';
import { CodacyApiServiceFactory } from '../factories/CodacyApiServiceFactory';
import {
    type ListOrganizationsParams,
    ListOrganizationsParamsSchema,
} from '../schemas/methods/ListOrganizationsParamsSchema';
import type { CodacyApiService } from '../services/CodacyApiService';
import type { SharedCommandParams } from '../types';
import { applyZodOptions } from '../utils/applyZodOptions';

export type ListOrganizationsActionParams = {
    logger: Logger;
    params: ListOrganizationsParams;
    service: CodacyApiService;
};
export type ListOrganizationsActionReturn = Table.Table;

export const listOrganizationsAction = async ({
    service,
    params,
}: ListOrganizationsActionParams): Promise<ListOrganizationsActionReturn> => {
    const options = ListOrganizationsParamsSchema.parse(params);
    const results = await service.listOrganizations(options);

    const table = new Table({
        head: ['ID', 'Remote ID', 'Name', 'Provider', 'Join Status', 'Join Mode', 'Type', 'Created'],
    });

    for (const org of results.data) {
        table.push([
            org.identifier,
            org.remoteIdentifier,
            org.name,
            org.provider,
            org.joinStatus,
            org.joinMode,
            org.type,
            org.created,
        ]);
    }

    return table;
};

export function listOrganizationsCommand({ program, logger }: SharedCommandParams) {
    const cmd = program.command('listOrganizations');
    cmd.description('List organizations for a provider');
    applyZodOptions(cmd, ListOrganizationsParamsSchema);
    cmd.action(async (params) => {
        const service = CodacyApiServiceFactory({ logger });
        const table = await listOrganizationsAction({ service, params, logger });
        console.log(table.toString());
    });
}
