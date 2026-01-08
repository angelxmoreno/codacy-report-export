import pino, { type Logger } from 'pino';
import pinoPretty from 'pino-pretty';

export const createLogger = (): Logger => pino(pinoPretty());
