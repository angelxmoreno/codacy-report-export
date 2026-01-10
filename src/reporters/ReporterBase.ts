import path from 'node:path';
import type { ReporterContext, ReporterInterface } from './ReporterInterface';

export type ReporterBaseParams = {
    extension: string;
};

export abstract class ReporterBase implements ReporterInterface {
    protected extension: string;

    protected constructor({ extension }: ReporterBaseParams) {
        this.extension = extension;
    }

    outputName(context: ReporterContext) {
        return `${context.prNumber}.${this.extension}`;
    }

    outputPath(context: ReporterContext) {
        return path.join(process.cwd(), 'codacy-reports', `${context.provider}-${context.org}-${context.name}`);
    }

    abstract render(context: ReporterContext): string | Promise<string>;
}
