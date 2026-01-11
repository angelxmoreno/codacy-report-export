import { describe, expect, it } from 'bun:test';
import { isPinoLogger } from '../../src/utils/isPinoLogger';
import { createMockLogger } from '../helpers/createMockLogger';

describe('isPinoLogger', () => {
    it('should return false for null or undefined', () => {
        expect(isPinoLogger(null)).toBe(false);
        expect(isPinoLogger(undefined)).toBe(false);
    });

    it('should return false for primitives', () => {
        expect(isPinoLogger('logger')).toBe(false);
        expect(isPinoLogger(123)).toBe(false);
    });

    it('should return false for empty objects', () => {
        expect(isPinoLogger({})).toBe(false);
    });

    it('should return false if missing child method', () => {
        const partialLogger = {
            debug: () => {},
            info: () => {},
            warn: () => {},
            error: () => {},
        };
        expect(isPinoLogger(partialLogger)).toBe(false);
    });

    it('should return false if missing debug method', () => {
        const partialLogger = {
            child: () => {},
            info: () => {},
            warn: () => {},
            error: () => {},
        };
        expect(isPinoLogger(partialLogger)).toBe(false);
    });

    it('should return false if missing info method', () => {
        const partialLogger = {
            child: () => {},
            debug: () => {},
            warn: () => {},
            error: () => {},
        };
        expect(isPinoLogger(partialLogger)).toBe(false);
    });

    it('should return false if missing warn method', () => {
        const partialLogger = {
            child: () => {},
            debug: () => {},
            info: () => {},
            error: () => {},
        };
        expect(isPinoLogger(partialLogger)).toBe(false);
    });

    it('should return false if missing error method', () => {
        const partialLogger = {
            child: () => {},
            debug: () => {},
            info: () => {},
            warn: () => {},
        };
        expect(isPinoLogger(partialLogger)).toBe(false);
    });

    it('should return true for a valid logger object', () => {
        const mockLogger = createMockLogger();
        expect(isPinoLogger(mockLogger)).toBe(true);
    });
});
