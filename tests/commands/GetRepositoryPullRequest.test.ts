import { describe, expect, it } from 'bun:test';
import Table from 'cli-table3';
import {
    type GetRepositoryPullRequestActionParams,
    getRepositoryPullRequestAction,
} from '../../src/commands/getRepositoryPullRequest';
import { Provider } from '../../src/enums/Provider';
import { CodacyApiService } from '../../src/services/CodacyApiService';
import { createMockHttpClient } from '../helpers/createMockHttpClient';
import { createMockLogger } from '../helpers/createMockLogger';

describe('GetRepositoryPullRequestCommand', () => {
    describe('Action', () => {
        const mockPR = {
            isUpToStandards: true,
            isAnalysing: false,
            pullRequest: {
                id: 1,
                number: 10,
                updated: '2023-01-01T00:00:00Z',
                status: 'Open',
                repository: 'test-repo',
                title: 'Test PR',
                owner: { name: 'User', avatarUrl: 'url', username: 'user' },
                headCommitSha: 'sha',
                commonAncestorCommitSha: 'sha',
                originBranch: 'feat',
                targetBranch: 'main',
            },
        };

        it('creates a Table instance with correct PR data', async () => {
            const mockLogger = createMockLogger();
            const mockHttpClient = createMockHttpClient(mockPR);
            const service = new CodacyApiService({
                logger: mockLogger,
                apiToken: 'test-token',
                httpClient: mockHttpClient,
            });
            const params: GetRepositoryPullRequestActionParams = {
                logger: mockLogger,
                service,
                params: {
                    remoteOrganizationName: 'org',
                    repositoryName: 'repo',
                    pullRequestNumber: 10,
                    provider: Provider.GitHub,
                },
            };

            const table = await getRepositoryPullRequestAction(params);

            expect(table).toBeInstanceOf(Table);
            const tableString = table.toString();
            expect(tableString).toContain('Test PR');
            expect(tableString).toContain('10');
            expect(tableString).toContain('Open');
        });
    });
});
