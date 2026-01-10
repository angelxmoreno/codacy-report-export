import { type AxiosInstance, type AxiosRequestConfig, isAxiosError } from 'axios';
import type { Logger } from 'pino';
import { ZodError, type z } from 'zod';
import { CodacyApiServiceError } from '../errors/CodacyApiServiceError';
import { type PaginatedApiOrganization, PaginatedApiOrganizationSchema } from '../schemas/api/ApiOrganizationSchema';
import {
    type ApiPullRequestIssuesResponse,
    ApiPullRequestIssuesResponseSchema,
} from '../schemas/api/ApiPullRequestIssuesResponseSchema';
import {
    type ApiPullRequestWithAnalysis,
    ApiPullRequestWithAnalysisSchema,
} from '../schemas/api/ApiPullRequestWithAnalysisSchema';
import {
    type PaginatedApiRepositoryBranch,
    PaginatedApiRepositoryBranchSchema,
} from '../schemas/api/ApiRepositoryBranchSchema';
import {
    type PaginatedApiRepositoryPullRequest,
    PaginatedApiRepositoryPullRequestSchema,
} from '../schemas/api/ApiRepositoryPullRequestSchema';
import { type PaginatedApiRepository, PaginatedApiRepositorySchema } from '../schemas/api/ApiRepositorySchema';
import { type ApiUser, type ApiUserResponse, ApiUserResponseSchema } from '../schemas/api/ApiUserSchema';
import { CodacyApiServiceConfigSchema } from '../schemas/CodacyApiServiceConfigSchema';
import {
    type GetRepositoryPullRequestParams,
    GetRepositoryPullRequestParamsSchema,
} from '../schemas/methods/GetRepositoryPullRequestParamsSchema';
import {
    type ListOrganizationsParams,
    ListOrganizationsParamsSchema,
} from '../schemas/methods/ListOrganizationsParamsSchema';
import {
    type ListPullRequestIssuesParams,
    ListPullRequestIssuesParamsSchema,
} from '../schemas/methods/ListPullRequestIssuesParamsSchema';
import {
    type ListRepositoriesParams,
    ListRepositoriesParamsSchema,
} from '../schemas/methods/ListRepositoriesParamsSchema';
import {
    type ListRepositoryBranchesParams,
    ListRepositoryBranchesParamsSchema,
} from '../schemas/methods/ListRepositoryBranchesParamsSchema';
import {
    type ListRepositoryPullRequestsParams,
    ListRepositoryPullRequestsParamsSchema,
} from '../schemas/methods/ListRepositoryPullRequestsParamsSchema';
import type { CodacyApiServiceConfig } from '../types';

export class CodacyApiService {
    protected baseUrl: string;
    protected logger: Logger;
    protected httpClient: AxiosInstance;
    protected apiToken: string;

    constructor(config: CodacyApiServiceConfig) {
        const { logger, httpClient, apiToken, baseUrl } = CodacyApiServiceConfigSchema.parse(config);
        this.logger = logger;
        this.httpClient = httpClient;
        this.apiToken = apiToken;
        this.baseUrl = baseUrl;
    }

    protected async request<T = unknown>(config: AxiosRequestConfig, schema?: z.ZodType<T>): Promise<T> {
        const requestConfig: AxiosRequestConfig = {
            ...config,
            method: config.method ?? 'GET',
            baseURL: this.baseUrl,
            headers: {
                Accept: 'application/json',
                ...config.headers,
                'api-token': '<redacted>',
            },
        };
        this.logger.debug(requestConfig, 'Calling Codacy API');
        let responseBody: T | null = null;

        try {
            const { data } = await this.httpClient.request<T>({
                ...requestConfig,
                headers: {
                    ...requestConfig.headers,
                    'api-token': this.apiToken,
                },
            });
            responseBody = data;
            return schema ? schema.parse(responseBody) : responseBody;
        } catch (error) {
            let exception: CodacyApiServiceError;

            if (error instanceof ZodError) {
                exception = CodacyApiServiceError.fromZodError(error, requestConfig, responseBody);
            } else if (isAxiosError(error)) {
                exception = CodacyApiServiceError.fromAxiosError(error);
            } else {
                exception = new CodacyApiServiceError('Error calling Codacy API', {
                    cause: error,
                    status: 400,
                });
            }
            const { message, context } = exception.getLogData();
            const { status, validationIssues } = context;
            this.logger.error({ status, validationIssues }, message);
            throw exception;
        }
    }

    async getCurrentUser(): Promise<ApiUser> {
        const { data } = await this.request<ApiUserResponse>(
            {
                url: '/user',
            },
            ApiUserResponseSchema
        );

        return data;
    }

    async listOrganizations(options: ListOrganizationsParams): Promise<PaginatedApiOrganization> {
        const { provider, ...params } = ListOrganizationsParamsSchema.parse(options);
        return await this.request<PaginatedApiOrganization>(
            {
                url: `/user/organizations/${provider}`,
                params,
            },
            PaginatedApiOrganizationSchema
        );
    }

    async listRepositories(options: ListRepositoriesParams): Promise<PaginatedApiRepository> {
        const { provider, remoteOrganizationName, ...params } = ListRepositoriesParamsSchema.parse(options);
        return this.request<PaginatedApiRepository>(
            {
                url: `/organizations/${provider}/${remoteOrganizationName}/repositories`,
                params,
            },
            PaginatedApiRepositorySchema
        );
    }

    async listRepositoryBranches(options: ListRepositoryBranchesParams): Promise<PaginatedApiRepositoryBranch> {
        const { provider, remoteOrganizationName, repositoryName, ...params } =
            ListRepositoryBranchesParamsSchema.parse(options);
        return this.request<PaginatedApiRepositoryBranch>(
            {
                url: `/organizations/${provider}/${remoteOrganizationName}/repositories/${repositoryName}/branches`,
                params,
            },
            PaginatedApiRepositoryBranchSchema
        );
    }

    async listRepositoryPullRequests(
        options: ListRepositoryPullRequestsParams
    ): Promise<PaginatedApiRepositoryPullRequest> {
        const { provider, remoteOrganizationName, repositoryName, ...params } =
            ListRepositoryPullRequestsParamsSchema.parse(options);
        return this.request<PaginatedApiRepositoryPullRequest>(
            {
                url: `/analysis/organizations/${provider}/${remoteOrganizationName}/repositories/${repositoryName}/pull-requests`,
                params,
            },
            PaginatedApiRepositoryPullRequestSchema
        );
    }

    async getRepositoryPullRequest(options: GetRepositoryPullRequestParams): Promise<ApiPullRequestWithAnalysis> {
        const { provider, remoteOrganizationName, repositoryName, pullRequestNumber } =
            GetRepositoryPullRequestParamsSchema.parse(options);
        return this.request(
            {
                url: `/analysis/organizations/${provider}/${remoteOrganizationName}/repositories/${repositoryName}/pull-requests/${pullRequestNumber}`,
            },
            ApiPullRequestWithAnalysisSchema
        );
    }

    async listPullRequestIssues(options: ListPullRequestIssuesParams): Promise<ApiPullRequestIssuesResponse> {
        const { provider, remoteOrganizationName, repositoryName, pullRequestNumber, ...params } =
            ListPullRequestIssuesParamsSchema.parse(options);
        return this.request(
            {
                url: `/analysis/organizations/${provider}/${remoteOrganizationName}/repositories/${repositoryName}/pull-requests/${pullRequestNumber}/issues`,
                params,
            },
            ApiPullRequestIssuesResponseSchema
        );
    }
}
