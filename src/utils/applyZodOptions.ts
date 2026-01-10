import type { Command } from 'commander';
import { z } from 'zod';

/**
 * Iterates over a Zod Object schema and adds corresponding options to a Commander command.
 *
 * @param command - The Commander command to attach options to.
 * @param schema - The Zod schema defining the options.
 * @param descriptions - Optional map of field names to description strings.
 */
export function applyZodOptions<T extends z.ZodRawShape>(
    command: Command,
    schema: z.ZodObject<T>,
    descriptions: Record<string, string> = {}
) {
    const { shape } = schema;

    for (const [key, zodType] of Object.entries(shape)) {
        let type: z.ZodTypeAny = zodType as z.ZodTypeAny;
        let isOptional = false;

        while (type instanceof z.ZodOptional || type instanceof z.ZodNullable) {
            isOptional = true;
            type = (type as z.ZodOptional<z.ZodTypeAny>).unwrap();
        }

        // Determine the flag format (camelCase key -> kebab-case flag)
        const flagName = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
        const description = descriptions[key] || (type.description ?? `Filter by ${key}`);

        // Helper to check for ZodDefault
        let isDefault = false;
        let defaultValue: unknown;
        if (type instanceof z.ZodDefault) {
            const defaulted = type as z.ZodDefault<z.ZodTypeAny>;
            isDefault = true;
            const def = defaulted.def as { defaultValue?: unknown; innerType?: z.ZodTypeAny } | undefined;
            if (def && 'defaultValue' in def) {
                defaultValue = def.defaultValue;
            }
            type = def?.innerType ?? defaulted.unwrap();
        }

        if (type instanceof z.ZodBoolean) {
            // Booleans are simple flags: --enabled or --no-enabled
            // For now, we assume positive flags.
            // If it's required and boolean, it's a bit odd for a CLI (usually implies a value),
            // but standard flags are optional toggles.
            const boolDefault = typeof defaultValue === 'boolean' ? defaultValue : undefined;
            if (boolDefault !== undefined) {
                command.option(`--${flagName}`, description, boolDefault);
            } else {
                command.option(`--${flagName}`, description);
            }
        } else if (type instanceof z.ZodNumber) {
            // Numbers need parsing
            const flag = `--${flagName} <number>`;
            const numberDefault = typeof defaultValue === 'number' ? defaultValue : undefined;
            if (!isOptional && !isDefault) {
                command.requiredOption(flag, description, parseFloat);
            } else {
                command.option(flag, description, parseFloat, numberDefault);
            }
        } else if (type instanceof z.ZodString || type instanceof z.ZodEnum) {
            // Strings and Enums take a value
            const stringDefault = typeof defaultValue === 'string' ? defaultValue : undefined;
            const flag = `--${flagName} <string>`;
            if (!isOptional && !isDefault) {
                command.requiredOption(flag, description);
            } else if (stringDefault !== undefined) {
                command.option(flag, description, stringDefault);
            } else {
                command.option(flag, description);
            }
        } else {
            // Fallback for unknown/complex types (like arrays or objects)
            // We might skip them or treat them as strings
            const flag = `--${flagName} <value>`;
            command.option(flag, `${description} (complex type)`);
        }
    }
}
