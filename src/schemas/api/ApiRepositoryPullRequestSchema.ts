import { z } from 'zod';
import { createPaginatedSchema } from './PaginationSchema';

const PullRequestOwnerSchema = z.object({
    name: z.string(),
    avatarUrl: z.string(),
    username: z.string().optional(),
    email: z.string().optional(),
});

const PullRequestInfoSchema = z.object({
    id: z.number(),
    number: z.number(),
    updated: z.iso.datetime(),
    status: z.string(),
    repository: z.string(),
    title: z.string(),
    owner: PullRequestOwnerSchema,
    headCommitSha: z.string(),
    commonAncestorCommitSha: z.string(),
    originBranch: z.string(),
    targetBranch: z.string(),
    gitHref: z.url().optional(),
});

const ResultReasonSchema = z.object({
    gate: z.string(),
    expected: z.number(),
    expectedThreshold: z.object({
        threshold: z.number(),
        minimumSeverity: z.string().optional(),
    }),
    isUpToStandards: z.boolean(),
});

const CoverageSchema = z.object({
    deltaCoverage: z.number(),
    diffCoverage: z.object({
        value: z.number(),
        coveredLines: z.number(),
        coverableLines: z.number(),
        cause: z.string().optional(),
    }),
    isUpToStandards: z.boolean(),
    resultReasons: z.array(ResultReasonSchema),
});

const QualitySchema = z.object({
    newIssues: z.number(),
    fixedIssues: z.number(),
    deltaComplexity: z.number(),
    deltaClonesCount: z.number(),
    isUpToStandards: z.boolean(),
    resultReasons: z.array(ResultReasonSchema),
});

const MetaSchema = z.object({
    analyzable: z.boolean(),
    reason: z.string().optional(),
});

export const ApiRepositoryPullRequestSchema = z.object({
    isUpToStandards: z.boolean(),
    isAnalysing: z.boolean(),
    pullRequest: PullRequestInfoSchema,
    newIssues: z.number().optional(),
    fixedIssues: z.number().optional(),
    deltaComplexity: z.number().optional(),
    deltaClonesCount: z.number().optional(),
    deltaCoverageWithDecimals: z.number().optional(),
    deltaCoverage: z.number().optional(),
    diffCoverage: z.number().optional(),
    coverage: CoverageSchema.optional(),
    quality: QualitySchema.optional(),
    meta: MetaSchema.optional(),
});

export const PaginatedApiRepositoryPullRequestSchema = createPaginatedSchema(ApiRepositoryPullRequestSchema);

export type ApiRepositoryPullRequest = z.infer<typeof ApiRepositoryPullRequestSchema>;
export type PaginatedApiRepositoryPullRequest = z.infer<typeof PaginatedApiRepositoryPullRequestSchema>;
