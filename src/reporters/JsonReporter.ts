import { ReporterBase } from './ReporterBase';
import type { ReporterContext } from './ReporterInterface';

export class JsonReporter extends ReporterBase {
    constructor() {
        super({
            extension: 'json',
        });
    }

    render(context: ReporterContext): string {
        return JSON.stringify(context.issues);
    }
}
