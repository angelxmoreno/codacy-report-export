import { mock } from 'bun:test';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * Creates a mock AxiosInstance using Bun's native mock() functions.
 * All methods return a resolved promise with a standard response structure.
 *
 * @param defaultResponseData - Optional default data to return in the mock response.
 */
export const createMockHttpClient = (defaultResponseData: unknown = {}): AxiosInstance => {
    const createResponse = (data: unknown): AxiosResponse => ({
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
    });

    return {
        request: mock(() => Promise.resolve(createResponse(defaultResponseData))),
        get: mock(() => Promise.resolve(createResponse(defaultResponseData))),
        post: mock(() => Promise.resolve(createResponse(defaultResponseData))),
        put: mock(() => Promise.resolve(createResponse(defaultResponseData))),
        patch: mock(() => Promise.resolve(createResponse(defaultResponseData))),
        delete: mock(() => Promise.resolve(createResponse(defaultResponseData))),
        head: mock(() => Promise.resolve(createResponse(defaultResponseData))),
        options: mock(() => Promise.resolve(createResponse(defaultResponseData))),
        defaults: { headers: { common: {} } },
        interceptors: {
            request: { use: mock(), eject: mock() },
            response: { use: mock(), eject: mock() },
        },
    } as unknown as AxiosInstance;
};
