import type { Command } from 'commander';
import type { Logger } from 'pino';

export type SharedCommandParams = {
    program: Command;
    logger: Logger;
};
