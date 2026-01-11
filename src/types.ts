import type { Command } from 'commander';
import type { Logger } from 'pino';
import type { z } from 'zod';

import type { CodacyApiServiceConfigSchema } from './schemas/CodacyApiServiceConfigSchema';

export type SharedCommandParams = {
    program: Command;
    logger: Logger;
};

export type CodacyApiServiceConfig = z.infer<typeof CodacyApiServiceConfigSchema>;
