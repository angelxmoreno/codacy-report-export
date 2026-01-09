import { z } from 'zod';
import { ApiPaginationSchema } from './PaginationSchema';

const PatternInfoSchema = z.object({
    id: z.string(),
    title: z.string().optional(),
    category: z.string(),
    subCategory: z.string().optional(),
    level: z.string(),
    severityLevel: z.string(),
});

const ToolInfoSchema = z.object({
    uuid: z.string(),
    name: z.string(),
});

const CommitInfoSchema = z.object({
    sha: z.string(),
    commiter: z.string(),
    commiterName: z.string(),
    timestamp: z.iso.datetime(),
});

const CommitIssueSchema = z.object({
    issueId: z.string(),
    resultDataId: z.number(),
    filePath: z.string(),
    fileId: z.number(),
    patternInfo: PatternInfoSchema,
    toolInfo: ToolInfoSchema,
    lineNumber: z.number(),
    message: z.string(),
    suggestion: z.string().optional(),
    language: z.string(),
    lineText: z.string().optional(),
    commitInfo: CommitInfoSchema,
    falsePositiveProbability: z.number().optional(),
    falsePositiveReason: z.string().optional(),
    falsePositiveThreshold: z.number().optional(),
});

export const ApiPullRequestIssueSchema = z.object({
    commitIssue: CommitIssueSchema,
    deltaType: z.string(),
});

export const ApiPullRequestIssuesResponseSchema = z.object({
    analyzed: z.boolean(),
    data: z.array(ApiPullRequestIssueSchema),
    pagination: ApiPaginationSchema,
});

export type ApiPullRequestIssue = z.infer<typeof ApiPullRequestIssueSchema>;
export type ApiPullRequestIssuesResponse = z.infer<typeof ApiPullRequestIssuesResponseSchema>;
