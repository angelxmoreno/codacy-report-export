import { describe, expect, it } from 'bun:test';
import { isAxiosInstance } from '../../src/utils/isAxiosInstance';

describe('isAxiosInstance', () => {
    it('should return false for null or undefined', () => {
        expect(isAxiosInstance(null)).toBe(false);
        expect(isAxiosInstance(undefined)).toBe(false);
    });

    it('should return false for primitives', () => {
        expect(isAxiosInstance('string')).toBe(false);
        expect(isAxiosInstance(123)).toBe(false);
        expect(isAxiosInstance(true)).toBe(false);
    });

    it('should return false for objects without request method', () => {
        expect(isAxiosInstance({})).toBe(false);
        expect(isAxiosInstance({ foo: 'bar' })).toBe(false);
    });

    it('should return false if request is not a function', () => {
        expect(isAxiosInstance({ request: 'not-a-function' })).toBe(false);
        expect(isAxiosInstance({ request: 123 })).toBe(false);
        expect(isAxiosInstance({ request: null })).toBe(false);
    });

    it('should return true for an object with a request function', () => {
        const mockAxios = {
            request: () => {},
        };
        expect(isAxiosInstance(mockAxios)).toBe(true);
    });
});
