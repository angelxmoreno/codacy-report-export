import { JsonReporter } from './JsonReporter';
import { JUnitReporter } from './JUnitReporter';
import { MarkDownReporter } from './MarkDownReporter';
import type { ReporterInterface } from './ReporterInterface';

export const REPORTERS: Record<string, ReporterInterface> = {
    json: new JsonReporter(),
    junit: new JUnitReporter(),
    markdown: new MarkDownReporter(),
};

export type ReporterType = keyof typeof REPORTERS;
