import { describe, expect, it } from 'bun:test';
import { JUnitReporter } from '../../src/reporters/JUnitReporter';
import type { ReporterContext } from '../../src/reporters/ReporterInterface';

describe('JUnitReporter', () => {
    it('should render valid XML', async () => {
        const reporter = new JUnitReporter();
        const context: ReporterContext = {
            provider: 'gh',
            org: 'codacy',
            name: 'test-repo',
            prNumber: 1,
            issues: [
                {
                    deltaType: 'Added',
                    commitIssue: {
                        issueId: '1',
                        resultDataId: 1,
                        filePath: 'src/index.ts',
                        fileId: 1,
                        lineNumber: 10,
                        message: 'Error < & > " quotes',
                        language: 'TypeScript',
                        patternInfo: {
                            id: 'pattern1',
                            title: 'Pattern 1',
                            category: 'Security',
                            level: 'Error',
                            severityLevel: 'Error',
                        },
                        toolInfo: { uuid: 'tool1', name: 'ESLint' },
                        commitInfo: { sha: 'sha', commiter: 'user', commiterName: 'User', timestamp: '2023-01-01' },
                    },
                },
            ],
        };

        const output = await reporter.render(context);

        // Basic XML validation
        expect(output).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(output).toContain('<testsuites name="Codacy Analysis" tests="1" failures="1">');
        expect(output).toContain('name="gh/codacy/test-repo PR#1"');

        // Check escaping
        expect(output).toContain('Error &lt; &amp; &gt; &quot; quotes');
        expect(output).toContain('classname="src/index.ts"');
    });
});
