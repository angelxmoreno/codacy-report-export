import { promises as fs } from 'node:fs';
import path from 'node:path';
import { InvalidArgumentError, Option } from 'commander';
import { z } from 'zod';
import type { SharedCommandParams } from '../types.ts';

const outputFormatSchema = z.enum(['json', 'prompt']);

const cliOptionsSchema = z.object({
    owner: z.string().min(1, 'owner is required'),
    repo: z.string().min(1, 'repo is required'),
    pr: z.number().int().positive('pr must be a positive integer'),
    token: z.string().min(1, 'CODACY_ACCOUNT_TOKEN is required'),
    format: outputFormatSchema,
    output: z.string().optional(),
});

type CliOptions = z.infer<typeof cliOptionsSchema>;

export function registerExportCommand({ program, logger }: SharedCommandParams) {
    program
        .command('export')
        .description('Export Codacy PR issues into a structured report.')
        .requiredOption('--owner <owner>', 'Repository owner or organization slug')
        .requiredOption('--repo <repo>', 'Repository name inside Codacy')
        .addOption(
            new Option('--pr <number>', 'Pull request number to export.')
                .argParser((value) => {
                    const parsed = Number.parseInt(value, 10);

                    if (Number.isNaN(parsed)) {
                        throw new InvalidArgumentError('Pull request number must be an integer.');
                    }

                    return parsed;
                })
                .makeOptionMandatory()
        )
        .option(
            '-t, --token <token>',
            'Codacy API token (defaults to CODACY_ACCOUNT_TOKEN).',
            process.env.CODACY_ACCOUNT_TOKEN
        )
        .addOption(
            new Option('-f, --format <format>', 'Choose the output format.')
                .choices(outputFormatSchema.options)
                .default('json')
        )
        .option('-o, --output <path>', 'Write the generated report to a file instead of stdout.')
        .action(async (rawOptions) => {
            try {
                const normalized = {
                    owner: rawOptions.owner as string,
                    repo: rawOptions.repo as string,
                    pr: Number(rawOptions.pr),
                    token: (rawOptions.token as string | undefined) ?? process.env.CODACY_ACCOUNT_TOKEN ?? '',
                    format: rawOptions.format as CliOptions['format'],
                    output: rawOptions.output as string | undefined,
                };

                const parsed = cliOptionsSchema.safeParse(normalized);

                if (!parsed.success) {
                    parsed.error.issues.forEach((issue) => {
                        logger.error(
                            { field: issue.path.join('.') || 'root', message: issue.message },
                            'Invalid CLI option'
                        );
                    });

                    process.exitCode = 1;
                    return;
                }

                await generatePlaceholderReport(parsed.data);
            } catch (error) {
                logger.error({ err: error }, 'Failed to execute codacy-report-export CLI');
                process.exitCode = 1;
            }
        });
}

async function generatePlaceholderReport(options: CliOptions) {
    const report = {
        status: 'not-implemented',
        repository: `${options.owner}/${options.repo}`,
        pullRequest: options.pr,
        format: options.format,
        generatedAt: new Date().toISOString(),
        message: 'Codacy export logic is not implemented yet. This placeholder confirms the CLI wiring.',
    };

    const payload = JSON.stringify(report, null, 2);

    if (options.output) {
        const absolutePath = path.resolve(process.cwd(), options.output);
        await fs.mkdir(path.dirname(absolutePath), { recursive: true });
        await fs.writeFile(absolutePath, payload, 'utf-8');
        // logger.info({ output: absolutePath }, 'Codacy report written');
        return;
    }

    process.stdout.write(`${payload}\n`);
}
