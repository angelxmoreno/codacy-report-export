#!/usr/bin/env node

import { Command } from 'commander';
import { registerExportCommand } from './commands/export-report';

const program = new Command()
    .name('codacy-report-export')
    .description('Export Codacy PR issues into deterministic, agent-ready reports.')
    .version(process.env.npm_package_version ?? '0.1.0');

registerExportCommand(program);

void program.parseAsync().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
