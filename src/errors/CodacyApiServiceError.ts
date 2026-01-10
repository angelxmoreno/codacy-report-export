import type { AxiosError, AxiosRequestConfig } from 'axios';
import type { ZodError, z } from 'zod';

type CodacyApiServiceErrorOptions = ErrorOptions & {
    requestConfig?: AxiosRequestConfig;
    responseBody?: unknown;
    validationIssues?: z.core.$ZodIssue[];
    status: number;
};

export const isCodacyApiServiceError = (error: unknown): error is CodacyApiServiceError => {
    return error instanceof CodacyApiServiceError;
};

export class CodacyApiServiceError extends Error {
    static ERROR_ZOD_MSG = 'Invalid response from Codacy API';
    static ERROR_API_MSG = 'Error from Codacy API';
    requestConfig?: AxiosRequestConfig;
    responseBody?: unknown;
    status: number;
    validationIssues?: z.core.$ZodIssue[];

    constructor(message = 'fetch failed', options: CodacyApiServiceErrorOptions) {
        const { status, requestConfig, responseBody, validationIssues, ...baseOptions } = options;
        super(message, baseOptions);
        this.name = 'CodacyApiServiceError';
        this.status = status;
        this.responseBody = responseBody;
        this.requestConfig = requestConfig;
        this.validationIssues = validationIssues;
    }

    static fromAxiosError(e: AxiosError) {
        return new CodacyApiServiceError(CodacyApiServiceError.ERROR_API_MSG, {
            cause: e,
            status: e.response?.status || e.status || 500,
            responseBody: e.response?.data,
            requestConfig: e.config,
        });
    }

    static fromZodError(e: ZodError, requestConfig: AxiosRequestConfig, responseBody: unknown) {
        return new CodacyApiServiceError(CodacyApiServiceError.ERROR_ZOD_MSG, {
            cause: e,
            status: 502,
            responseBody: responseBody,
            requestConfig: requestConfig,
            validationIssues: e.issues,
        });
    }

    getLogData(): {
        message: string;
        context: {
            requestConfig?: AxiosRequestConfig;
            responseBody?: unknown;
            status: number;
            validationIssues?: z.core.$ZodIssue[];
        };
    } {
        return {
            message: this.message,
            context: {
                status: this.status,
                responseBody: this.responseBody,
                requestConfig: this.requestConfig,
                validationIssues: this.validationIssues,
            },
        };
    }
}
