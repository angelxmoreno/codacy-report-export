#!/usr/bin/env node

import { Command } from 'commander';
import { registerExportCommand } from './commands/export-report';
import { listOrganizationsCommand } from './commands/listOrganizations';
import { registerTestApi } from './commands/test-api';
import { createLogger } from './utils/createLogger';

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
registerTestApi({ program, logger: cliLogger });
listOrganizationsCommand({ program, logger: cliLogger });

program.exitOverride();

try {
    await program.parseAsync(process.argv);
} catch (error: unknown) {
    let handled = false;
    if (error instanceof Error && 'code' in error) {
        const { code } = error;
        if (code === 'commander.help' || code === 'commander.helpDisplayed' || code === 'commander.version') {
            handled = true;
            if (process.exitCode === undefined) {
                process.exitCode = 0;
            }
        }
    }

    if (!handled) {
        cliLogger.error(error, '❌ CLI Error:');
        if (process.exitCode === undefined) {
            process.exitCode = 1;
        }
    }
}
