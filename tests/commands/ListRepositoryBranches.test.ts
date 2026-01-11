import { describe, expect, it } from 'bun:test';
import Table from 'cli-table3';
import {
    type ListRepositoryBranchesActionParams,
    listRepositoryBranchesAction,
} from '../../src/commands/listRepositoryBranches';
import { Provider } from '../../src/enums/Provider';
import { CodacyApiService } from '../../src/services/CodacyApiService';
import { createMockHttpClient } from '../helpers/createMockHttpClient';
import { createMockLogger } from '../helpers/createMockLogger';

describe('ListRepositoryBranchesCommand', () => {
    describe('Action', () => {
        const mockResponse = {
            pagination: { limit: 100 },
            data: [
                {
                    id: 1,
                    name: 'main',
                    isDefault: true,
                    isEnabled: true,
                    branchType: 'Branch',
                    lastUpdated: '2023-01-01T00:00:00Z',
                    lastCommit: 'sha',
                },
            ],
        };

        it('creates a Table instance with branch data', async () => {
            const mockLogger = createMockLogger();
            const mockHttpClient = createMockHttpClient(mockResponse);
            const service = new CodacyApiService({
                logger: mockLogger,
                apiToken: 'test-token',
                httpClient: mockHttpClient,
                baseUrl: 'https://api.codacy.com/api/v3',
            });
            const params: ListRepositoryBranchesActionParams = {
                logger: mockLogger,
                service,
                params: {
                    remoteOrganizationName: 'org',
                    repositoryName: 'repo',
                    provider: Provider.GitHub,
                },
            };

            const table = await listRepositoryBranchesAction(params);

            expect(table).toBeInstanceOf(Table);
            const tableString = table.toString();
            expect(tableString).toContain('main');
            expect(tableString).toContain('Yes'); // isDefault
            expect(tableString).toContain('Branch');
        });
    });
});
