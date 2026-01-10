import { describe, expect, it } from 'bun:test';
import { AxiosError, type AxiosRequestHeaders, type InternalAxiosRequestConfig } from 'axios';
import { z } from 'zod';
import { CodacyApiServiceError } from '../../src/errors/CodacyApiServiceError';

describe('CodacyApiServiceError', () => {
    it('should implement getLogData correctly', () => {
        const error = new CodacyApiServiceError('Test Error', {
            status: 404,
            responseBody: { error: 'Not Found' },
        });

        const logData = error.getLogData();
        expect(logData.message).toBe('Test Error');
        expect(logData.context.status).toBe(404);
        expect(logData.context.responseBody).toEqual({ error: 'Not Found' });
    });

    it('should create from Axios error', () => {
        const axiosConfig: InternalAxiosRequestConfig = {
            url: '/test',
            headers: {} as AxiosRequestHeaders,
        };
        const mockAxiosError = new AxiosError('Failure', 'ERR', axiosConfig);
        mockAxiosError.response = {
            status: 500,
            statusText: 'Server Error',
            config: axiosConfig,
            headers: {},
            data: 'Server Error',
        };

        const error = CodacyApiServiceError.fromAxiosError(mockAxiosError);
        expect(error.message).toBe(CodacyApiServiceError.ERROR_API_MSG);
        expect(error.status).toBe(500);
        expect(error.requestConfig).toEqual(expect.objectContaining({ url: '/test' }));
    });

    it('should create from Zod error', () => {
        const mockSchema = z.object({
            id: z.number(),
        });
        let mockZodError: z.ZodError;
        try {
            mockSchema.parse({ id: 'oops' });
            throw new Error('Expected parse to fail');
        } catch (error) {
            mockZodError = error as z.ZodError;
        }

        const error = CodacyApiServiceError.fromZodError(mockZodError, {}, { data: 'bad' });
        expect(error.message).toBe(CodacyApiServiceError.ERROR_ZOD_MSG);
        expect(error.status).toBe(502);
        expect(error.validationIssues).toHaveLength(1);
    });
});
