import { mock } from 'bun:test';
import type { Logger } from 'pino';

/**
 * Creates a mock Pino logger using Bun's native mock() functions.
 * All logging methods are stubs, and .child() returns the logger itself to support chaining.
 */
export const createMockLogger = (): Logger => {
    const logger = {
        level: 'silent',
        info: mock(() => {}),
        debug: mock(() => {}),
        error: mock(() => {}),
        warn: mock(() => {}),
        fatal: mock(() => {}),
        trace: mock(() => {}),
        silent: mock(() => {}),
        // For .child(), we return the logger itself so chained calls work
        child: mock(() => logger),
    } as unknown as Logger;

    return logger;
};
