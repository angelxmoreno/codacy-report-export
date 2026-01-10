import { describe, expect, it } from 'bun:test';
import Table from 'cli-table3';
import { type ListOrganizationsActionParams, listOrganizationsAction } from '../../src/commands/listOrganizations';
import { Provider } from '../../src/enums/Provider';
import { CodacyApiService } from '../../src/services/CodacyApiService';
import { createMockHttpClient } from '../helpers/createMockHttpClient';
import { createMockLogger } from '../helpers/createMockLogger';

describe('ListOrganizationsCommand', () => {
    describe('Action', () => {
        const mockOrg = {
            identifier: 123,
            remoteIdentifier: 'remote-123',
            name: 'Test Org',
            provider: 'gh',
            joinStatus: 'Joined',
            joinMode: 'Auto',
            type: 'Organization',
            created: '2023-01-01T00:00:00Z',
            singleProviderLogin: true,
            hasDastAccess: false,
            hasScaEnabled: true,
            avatar: 'http://example.com/avatar.png',
        };

        it('creates a Table instance with correct data', async () => {
            const mockLogger = createMockLogger();
            const mockHttpClient = createMockHttpClient({
                data: [mockOrg],
                pagination: { limit: 10 },
            });
            const service = new CodacyApiService({
                logger: mockLogger,
                apiToken: 'test-token',
                httpClient: mockHttpClient,
            });
            const params: ListOrganizationsActionParams = {
                logger: mockLogger,
                service,
                params: {
                    provider: Provider.GitHub,
                },
            };

            const table = await listOrganizationsAction(params);

            expect(table).toBeInstanceOf(Table);

            // Verify Headers
            const { head } = table.options;
            expect(head).toContain('ID');
            expect(head).toContain('Name');
            expect(head).toContain('Provider');

            // Verify Row Data
            const tableString = table.toString();
            expect(tableString).toContain('123');
            expect(tableString).toContain('Test Org');
            expect(tableString).toContain('gh');
            expect(tableString).toContain('Joined');
        });

        it('calls the service with correct provider', async () => {
            const mockLogger = createMockLogger();
            const mockHttpClient = createMockHttpClient({
                data: [],
                pagination: { limit: 10 },
            });
            const service = new CodacyApiService({
                logger: mockLogger,
                apiToken: 'test-token',
                httpClient: mockHttpClient,
            });
            const params: ListOrganizationsActionParams = {
                logger: mockLogger,
                service,
                params: {
                    provider: Provider.GitLab,
                },
            };

            await listOrganizationsAction(params);

            // Verify the HTTP request was made to the correct URL
            expect(mockHttpClient.request).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: '/user/organizations/gl',
                })
            );
        });
    });
});
