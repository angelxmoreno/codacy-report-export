import path from 'node:path';
import { Eta } from 'eta';
import { EtaRendererReporter } from './EtaRendererReporter';

export class MarkDownReporter extends EtaRendererReporter {
    constructor() {
        super({
            extension: 'md',
            eta: new Eta({ views: path.join(import.meta.dir, '../templates/') }),
            templateName: 'Report.md.eta',
        });
    }
}
