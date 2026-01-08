import type { Logger } from 'pino';

export const isPinoLogger = (value: unknown): value is Logger => {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const candidate = value as Logger;

    return (
        typeof candidate.child === 'function' &&
        typeof candidate.debug === 'function' &&
        typeof candidate.info === 'function' &&
        typeof candidate.warn === 'function' &&
        typeof candidate.error === 'function'
    );
};
