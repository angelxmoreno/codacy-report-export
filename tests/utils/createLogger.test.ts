import { describe, expect, it } from 'bun:test';
import { createLogger } from '../../src/utils/createLogger';

describe('createLogger', () => {
    it('should return a pino logger instance', () => {
        const logger = createLogger();
        expect(logger).toBeDefined();
        expect(typeof logger.info).toBe('function');
        expect(typeof logger.debug).toBe('function');
        expect(typeof logger.warn).toBe('function');
        expect(typeof logger.error).toBe('function');
        expect(typeof logger.child).toBe('function');
    });

    it('should honor LOG_LEVEL environment variable', () => {
        const originalLevel = process.env.LOG_LEVEL;
        process.env.LOG_LEVEL = 'debug';

        try {
            const logger = createLogger();
            expect(logger.level).toBe('debug');
        } finally {
            process.env.LOG_LEVEL = originalLevel;
        }
    });
});
