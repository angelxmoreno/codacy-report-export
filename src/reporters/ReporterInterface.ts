import type { ApiPullRequestIssue } from '../schemas/api/ApiPullRequestIssuesResponseSchema';

export type ReporterContext = {
    provider: string;
    org: string;
    name: string;
    prNumber: number;
    issues: ApiPullRequestIssue[];
};

export interface ReporterInterface {
    outputName(context: ReporterContext): string | Promise<string>;
    outputPath(context: ReporterContext): string | Promise<string>;
    render(context: ReporterContext): string | Promise<string>;
}
