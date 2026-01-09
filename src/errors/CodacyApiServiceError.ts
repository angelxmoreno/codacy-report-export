import type { AxiosError, AxiosRequestConfig } from 'axios';

type CodacyApiServiceErrorOptions = ErrorOptions & {
    requestConfig?: AxiosRequestConfig;
    responseBody?: unknown;
    status: number;
};
export class CodacyApiServiceError extends Error {
    requestConfig?: AxiosRequestConfig;
    responseBody?: unknown;
    status: number;

    constructor(message = 'fetch failed', options: CodacyApiServiceErrorOptions) {
        const { status, requestConfig, responseBody, ...baseOptions } = options;
        super(message, baseOptions);
        this.name = 'CodacyApiServiceError';
        this.status = status;
        this.responseBody = responseBody;
        this.requestConfig = requestConfig;
    }

    static fromAxiosError(e: AxiosError, message: string = 'Error from Codacy API') {
        return new CodacyApiServiceError(message, {
            cause: e,
            status: e.response?.status || e.status || 500,
            responseBody: e.response?.data,
            requestConfig: e.config,
        });
    }
}
