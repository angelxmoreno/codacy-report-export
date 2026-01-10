import { describe, expect, it } from 'bun:test';
import Table from 'cli-table3';
import { type ListRepositoriesActionParams, listRepositoriesAction } from '../../src/commands/listRepositories';
import { Provider } from '../../src/enums/Provider';
import { CodacyApiService } from '../../src/services/CodacyApiService';
import { createMockHttpClient } from '../helpers/createMockHttpClient';
import { createMockLogger } from '../helpers/createMockLogger';

describe('ListRepositoriesCommand', () => {
    describe('Action', () => {
        const mockResponse = {
            pagination: { limit: 100 },
            data: [
                {
                    repositoryId: 1,
                    name: 'repo-1',
                    visibility: 'Public',
                    languages: ['TypeScript'],
                    lastUpdated: '2023-01-01T00:00:00Z',
                    provider: Provider.GitHub,
                    owner: 'org',
                    remoteIdentifier: '123',
                    addedState: 'Added',
                    problems: [],
                    standards: [],
                },
            ],
        };

        it('creates a Table instance with repo data', async () => {
            const mockLogger = createMockLogger();
            const mockHttpClient = createMockHttpClient(mockResponse);
            const service = new CodacyApiService({
                logger: mockLogger,
                apiToken: 'test-token',
                httpClient: mockHttpClient,
                baseUrl: 'https://api.codacy.com/api/v3',
            });
            const params: ListRepositoriesActionParams = {
                logger: mockLogger,
                service,
                params: {
                    remoteOrganizationName: 'org',
                    provider: Provider.GitHub,
                },
            };

            const table = await listRepositoriesAction(params);

            expect(table).toBeInstanceOf(Table);
            const tableString = table.toString();
            expect(tableString).toContain('repo-1');
            expect(tableString).toContain('Public');
            expect(tableString).toContain('TypeScript');
        });
    });
});
