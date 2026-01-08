#!/usr/bin/env node

import { Command } from 'commander';
import { registerExportCommand } from './commands/export-report';
import { createLogger } from './utils/createLogger.ts';

const cliLogger = createLogger().child({
    name: 'codacy-report-export',
});

const program = new Command()
    .name('codacy-report-export')
    .description('Export Codacy PR issues into deterministic, agent-ready reports.')
    .version(process.env.npm_package_version ?? '0.1.0');

program.option('-d, --debug', 'output extra debugging information').hook('preAction', () => {
    if (program.opts().debug) {
        cliLogger.level = 'debug';
    }
});

registerExportCommand({ program, logger: cliLogger });

program.exitOverride();

try {
    await program.parseAsync(process.argv);
    process.exit(0);
} catch (error: unknown) {
    if (error instanceof Error && 'code' in error) {
        if (error.code === 'commander.help' || error.code === 'commander.helpDisplayed') {
            process.exit(0);
        }
        if (error.code === 'commander.version') {
            process.exit(0);
        }
    }

    cliLogger.error(error, '❌ CLI Error:');
    process.exit(1);
}
