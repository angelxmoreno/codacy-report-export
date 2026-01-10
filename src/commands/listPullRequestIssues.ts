import Table from 'cli-table3';
import type { Logger } from 'pino';
import { CodacyApiServiceFactory } from '../factories/CodacyApiServiceFactory';
import {
    type ListPullRequestIssuesParams,
    ListPullRequestIssuesParamsSchema,
} from '../schemas/methods/ListPullRequestIssuesParamsSchema';
import type { CodacyApiService } from '../services/CodacyApiService';
import type { SharedCommandParams } from '../types';
import { applyZodOptions } from '../utils/applyZodOptions';

export type ListPullRequestIssuesActionParams = {
    logger: Logger;
    params: ListPullRequestIssuesParams;
    service: CodacyApiService;
};
export type ListPullRequestIssuesActionReturn = Table.Table;

export const listPullRequestIssuesAction = async ({
    service,
    params,
}: ListPullRequestIssuesActionParams): Promise<ListPullRequestIssuesActionReturn> => {
    const options = ListPullRequestIssuesParamsSchema.parse(params);
    const results = await service.listPullRequestIssues(options);

    const table = new Table({
        head: ['Issue ID', 'File Path', 'Line', 'Message', 'Severity', 'Pattern ID', 'Tool', 'Delta Type'],
    });

    for (const issue of results.data) {
        const { commitIssue, deltaType } = issue;
        table.push([
            commitIssue.issueId,
            commitIssue.filePath,
            commitIssue.lineNumber,
            commitIssue.message,
            commitIssue.patternInfo.severityLevel,
            commitIssue.patternInfo.id,
            commitIssue.toolInfo.name,
            deltaType,
        ]);
    }

    return table;
};

export function listPullRequestIssuesCommand({ program, logger }: SharedCommandParams) {
    const cmd = program.command('listPullRequestIssues');
    cmd.description('List issues for a pull request');
    applyZodOptions(cmd, ListPullRequestIssuesParamsSchema);
    cmd.action(async (params) => {
        const service = CodacyApiServiceFactory({ logger });
        const table = await listPullRequestIssuesAction({ service, params, logger });
        console.log(table.toString());
    });
}
