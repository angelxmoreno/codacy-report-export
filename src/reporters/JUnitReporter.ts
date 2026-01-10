import path from 'node:path';
import { Eta } from 'eta';
import { EtaRendererReporter } from './EtaRendererReporter';
import type { ReporterContext } from './ReporterInterface';

// Helper for XML escaping
const xmlEscape = (str: string | undefined | null) => {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

export class JUnitReporter extends EtaRendererReporter {
    constructor() {
        super({
            extension: 'xml',
            eta: new Eta({ views: path.join(import.meta.dir, '../templates/') }),
            templateName: 'JUnit.xml.eta',
        });
    }

    // Override render to inject the escape helper
    override render(context: ReporterContext): Promise<string> {
        const enrichedContext = {
            ...context,
            escape: xmlEscape,
        };
        return this.eta.renderAsync(this.templateName, enrichedContext);
    }
}
