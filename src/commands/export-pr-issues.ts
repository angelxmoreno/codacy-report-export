import fs from 'node:fs';
import path from 'node:path';
import { select } from '@inquirer/prompts';
import type { Logger } from 'pino';
import { ProviderEnumSchema } from '../enums/Provider';
import { isCodacyApiServiceError } from '../errors/CodacyApiServiceError';
import { CodacyApiServiceFactory } from '../factories/CodacyApiServiceFactory';
import { REPORTERS, type ReporterType } from '../reporters';
import type { ReporterContext } from '../reporters/ReporterInterface';
import type { CodacyApiService } from '../services/CodacyApiService';
import type { SharedCommandParams } from '../types';

export type ExportPrIssuesActionParams = {
    logger: Logger;
    repoPath: string; // Syntax: provider/orgName/repoName
    prNumber?: number;
    format?: ReporterType;
    output?: string;
    service: CodacyApiService;
};

export const exportPrIssuesAction = async ({
    service,
    repoPath,
    prNumber,
    format = 'markdown',
    output,
    logger,
}: ExportPrIssuesActionParams) => {
    // 1. Parse repoPath
    const parts = repoPath.split('/');
    if (parts.length !== 3) {
        throw new Error('Invalid repository path format. Expected: provider/orgName/repoName');
    }

    const [providerStr, remoteOrganizationName, repositoryName] = parts;
    if (!providerStr || !remoteOrganizationName || !repositoryName) {
        throw new Error('Malformed repository path format. Expected: provider/orgName/repoName');
    }
    const provider = ProviderEnumSchema.parse(providerStr);

    logger.debug({ provider, remoteOrganizationName, repositoryName, prNumber }, 'Exporting PR issues');

    let pullRequestNumber = prNumber;

    if (!pullRequestNumber) {
        const { data } = await service.listRepositoryPullRequests({
            provider,
            remoteOrganizationName,
            repositoryName,
        });

        if (data.length === 0) {
            throw new Error(`No open pull requests found for ${repoPath}.`);
        }

        const choices = data.map(({ pullRequest }) => ({
            name: `PR#${pullRequest.number} ${pullRequest.title}`,
            value: pullRequest.number,
            description: pullRequest.status,
        }));

        pullRequestNumber = await select({
            message: 'Select a Pull Request',
            choices,
        });
    }

    try {
        const issuesResponse = await service.listPullRequestIssues({
            provider,
            remoteOrganizationName,
            repositoryName,
            pullRequestNumber,
        });

        logger.info(`Found ${issuesResponse.data.length} issues.`);

        const reporter = REPORTERS[format];
        if (!reporter) {
            throw new Error(`Invalid format: ${format}. Available: ${Object.keys(REPORTERS).join(', ')}`);
        }

        const context: ReporterContext = {
            provider,
            org: remoteOrganizationName,
            name: repositoryName,
            prNumber: pullRequestNumber,
            issues: issuesResponse.data,
        };

        const reportContent = await reporter.render(context);

        // Determine final output path
        // If output is provided, use it.
        // If not, ask the reporter for the default path + name.
        let finalPath = output;

        if (!finalPath) {
            // If the reporter suggests a directory structure, we use it,
            // but for CLI usage, dumping in CWD with a smart name is often preferred unless specified.
            // Let's use the reporter's suggested filename in the current directory by default for simplicity,
            // OR follow the reporter's outputPath logic if it's opinionated.
            // The ReporterBase.outputPath() returns 'codacy-reports/...' which implies a structure.
            // Let's respect that structure if no output arg is given.
            const dir = await reporter.outputPath(context);
            const name = await reporter.outputName(context);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            finalPath = path.join(dir, name);
        }

        fs.writeFileSync(finalPath, reportContent);
        logger.info(`Report saved to: ${finalPath}`);
    } catch (e) {
        if (isCodacyApiServiceError(e) && e.status === 404) {
            logger.error(
                {
                    provider,
                    remoteOrganizationName,
                    repositoryName,
                    pullRequestNumber,
                },
                'Pull request not found'
            );
            return;
        }
        throw e;
    }
};

export function exportPrIssuesCommand({ program, logger }: SharedCommandParams) {
    program
        .command('export-pr-issues')
        .description('Export a report of issues for a specific repository or pull request')
        .argument(
            '<repo-path>',
            'Repository path in format {provider}/{orgName}/{repoName} (e.g., gh/angelxmoreno/codacy-report-export)'
        )
        .option('--pr <number>', 'The pull request number (e.g., 42)', (val) => parseInt(val, 10))
        .option('--format <type>', 'Report format (markdown)', 'markdown')
        .option('--output <path>', 'Output file path (overrides default naming)')
        .addHelpText(
            'after',
            `
Example:
  $ codacy-report-export export-pr-issues gh/codacy/codacy-report-export --pr 2`
        )
        .action(async (repoPath, options) => {
            const service = CodacyApiServiceFactory({ logger });
            await exportPrIssuesAction({
                service,
                repoPath,
                prNumber: options.pr,
                format: options.format,
                output: options.output,
                logger,
            });
        });
}
