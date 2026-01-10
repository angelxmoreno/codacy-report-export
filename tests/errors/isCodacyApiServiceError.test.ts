import { describe, expect, it } from 'bun:test';
import { CodacyApiServiceError, isCodacyApiServiceError } from '../../src/errors/CodacyApiServiceError';

describe('isCodacyApiServiceError', () => {
    it('should return true for CodacyApiServiceError instances', () => {
        const error = new CodacyApiServiceError('test', { status: 400 });
        expect(isCodacyApiServiceError(error)).toBe(true);
    });

    it('should return false for generic Error instances', () => {
        const error = new Error('test');
        expect(isCodacyApiServiceError(error)).toBe(false);
    });

    it('should return false for plain objects', () => {
        expect(isCodacyApiServiceError({ message: 'test' })).toBe(false);
    });

    it('should return false for primitives', () => {
        expect(isCodacyApiServiceError('error')).toBe(false);
        expect(isCodacyApiServiceError(null)).toBe(false);
    });
});
