import pino, { type Logger } from 'pino';
import pinoPretty from 'pino-pretty';

const resolveLogLevel = (): Logger['level'] => {
    const desired = process.env.LOG_LEVEL;
    if (desired && ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'].includes(desired)) {
        return desired as Logger['level'];
    }
    return 'info';
};

export const createLogger = (): Logger =>
    pino(
        {
            level: resolveLogLevel(),
        },
        pinoPretty({
            destination: 2,
        })
    );
