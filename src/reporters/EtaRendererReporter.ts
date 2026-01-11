import type { Eta } from 'eta';
import { ReporterBase } from './ReporterBase';
import type { ReporterContext } from './ReporterInterface';

export type EtaRendererReporterParams = {
    extension: string;
    templateName: string;
    eta: Eta;
};

export class EtaRendererReporter extends ReporterBase {
    protected templateName: string;
    protected eta: Eta;

    constructor({ extension, templateName, eta }: EtaRendererReporterParams) {
        super({ extension });
        this.templateName = templateName;
        this.eta = eta;
    }

    render(context: ReporterContext): Promise<string> {
        return this.eta.renderAsync(this.templateName, context);
    }
}
