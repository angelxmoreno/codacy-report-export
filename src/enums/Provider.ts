import { z } from 'zod';

export enum Provider {
    GitHub = 'gh',
    GitLab = 'gl',
    Bitbucket = 'bb',
    AzureDevOps = 'ado',
}

export const ProviderEnumSchema = z.enum(Provider);
