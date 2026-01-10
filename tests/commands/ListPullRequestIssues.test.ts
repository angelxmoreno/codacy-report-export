import { describe, expect, it } from 'bun:test';
import Table from 'cli-table3';
import {
    type ListPullRequestIssuesActionParams,
    listPullRequestIssuesAction,
} from '../../src/commands/listPullRequestIssues';
import { Provider } from '../../src/enums/Provider';
import { CodacyApiService } from '../../src/services/CodacyApiService';
import { createMockHttpClient } from '../helpers/createMockHttpClient';
import { createMockLogger } from '../helpers/createMockLogger';

describe('ListPullRequestIssuesCommand', () => {
    describe('Action', () => {
        const mockResponse = {
            analyzed: true,
            pagination: { limit: 100 },
            data: [
                {
                    deltaType: 'Added',
                    commitIssue: {
                        issueId: 'issue-1',
                        resultDataId: 1,
                        filePath: 'src/file.ts',
                        fileId: 1,
                        lineNumber: 42,
                        message: 'Fix me',
                        language: 'TypeScript',
                        patternInfo: {
                            id: 'pattern-1',
                            title: 'Title',
                            category: 'CodeStyle',
                            level: 'Warning',
                            severityLevel: 'Warning',
                        },
                        toolInfo: { uuid: 'tool-1', name: 'ESLint' },
                        commitInfo: {
                            sha: 'sha',
                            commiter: 'me',
                            commiterName: 'Me',
                            timestamp: '2023-01-01T00:00:00Z',
                        },
                    },
                },
            ],
        };

        it('creates a Table instance with issue data', async () => {
            const mockLogger = createMockLogger();
            const mockHttpClient = createMockHttpClient(mockResponse);
            const service = new CodacyApiService({
                logger: mockLogger,
                apiToken: 'test-token',
                httpClient: mockHttpClient,
                baseUrl: 'https://api.codacy.com/api/v3',
            });
            const params: ListPullRequestIssuesActionParams = {
                logger: mockLogger,
                service,
                params: {
                    remoteOrganizationName: 'org',
                    repositoryName: 'repo',
                    pullRequestNumber: 10,
                    provider: Provider.GitHub,
                },
            };

            const table = await listPullRequestIssuesAction(params);

            expect(table).toBeInstanceOf(Table);
            const tableString = table.toString();
            expect(tableString).toContain('issue-1');
            expect(tableString).toContain('src/file.ts');
            expect(tableString).toContain('Fix me');
            expect(tableString).toContain('ESLint');
        });
    });
});
