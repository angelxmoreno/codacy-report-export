import { describe, expect, it } from 'bun:test';
import Table from 'cli-table3';
import {
    type ListRepositoryPullRequestsActionParams,
    listRepositoryPullRequestsAction,
} from '../../src/commands/listRepositoryPullRequests';
import { Provider } from '../../src/enums/Provider';
import { CodacyApiService } from '../../src/services/CodacyApiService';
import { createMockHttpClient } from '../helpers/createMockHttpClient';
import { createMockLogger } from '../helpers/createMockLogger';

describe('ListRepositoryPullRequestsCommand', () => {
    describe('Action', () => {
        const mockResponse = {
            pagination: { limit: 100 },
            data: [
                {
                    isUpToStandards: true,
                    isAnalysing: false,
                    pullRequest: {
                        id: 1,
                        number: 42,
                        updated: '2023-01-01T00:00:00Z',
                        status: 'Open',
                        repository: 'repo',
                        title: 'My Feature',
                        owner: { name: 'User', avatarUrl: '', username: 'user' },
                        headCommitSha: 'sha',
                        commonAncestorCommitSha: 'sha',
                        originBranch: 'feat',
                        targetBranch: 'main',
                    },
                },
            ],
        };

        it('creates a Table instance with PR data', async () => {
            const mockLogger = createMockLogger();
            const mockHttpClient = createMockHttpClient(mockResponse);
            const service = new CodacyApiService({
                logger: mockLogger,
                apiToken: 'test-token',
                httpClient: mockHttpClient,
                baseUrl: 'https://api.codacy.com/api/v3',
            });
            const params: ListRepositoryPullRequestsActionParams = {
                service,
                params: {
                    remoteOrganizationName: 'org',
                    repositoryName: 'repo',
                    provider: Provider.GitHub,
                },
            };

            const table = await listRepositoryPullRequestsAction(params);

            expect(table).toBeInstanceOf(Table);
            const tableString = table.toString();
            expect(tableString).toContain('My Feature');
            expect(tableString).toContain('42');
            expect(tableString).toContain('Open');
        });
    });
});
