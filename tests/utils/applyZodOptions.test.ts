import { describe, expect, it } from 'bun:test';
import { Command } from 'commander';
import { z } from 'zod';
import { applyZodOptions } from '../../src/utils/applyZodOptions';

describe('applyZodOptions', () => {
    it('should add string options correctly', () => {
        const schema = z.object({
            name: z.string(),
            category: z.string().optional(),
        });
        const cmd = new Command();
        applyZodOptions(cmd, schema);

        const options = cmd.options;
        expect(options).toHaveLength(2);

        const nameOpt = options.find((o) => o.long === '--name');
        expect(nameOpt).toBeDefined();
        expect(nameOpt?.mandatory).toBe(true); // Required string

        const catOpt = options.find((o) => o.long === '--category');
        expect(catOpt).toBeDefined();
        expect(catOpt?.mandatory).toBe(false); // Optional string
    });

    it('should add number options with parser', () => {
        const schema = z.object({
            limit: z.number().int(),
        });
        const cmd = new Command();
        applyZodOptions(cmd, schema);

        const limitOpt = cmd.options.find((o) => o.long === '--limit');
        expect(limitOpt).toBeDefined();
        // Commander internal check for parser presence is tricky without looking at private props,
        // but we can check the flags format
        expect(limitOpt?.flags).toContain('<number>');
    });

    it('should add boolean flags', () => {
        const schema = z.object({
            verbose: z.boolean(),
        });
        const cmd = new Command();
        applyZodOptions(cmd, schema);

        const verboseOpt = cmd.options.find((o) => o.long === '--verbose');
        expect(verboseOpt).toBeDefined();
        // Boolean flags shouldn't have angle brackets like <value>
        expect(verboseOpt?.flags).not.toContain('<');
    });

    it('should convert camelCase to kebab-case', () => {
        const schema = z.object({
            remoteOrganizationName: z.string(),
        });
        const cmd = new Command();
        applyZodOptions(cmd, schema);

        const opt = cmd.options.find((o) => o.long === '--remote-organization-name');
        expect(opt).toBeDefined();
    });

    it('should use schema descriptions with optional overrides', () => {
        const schema = z.object({
            status: z.string().describe('Status filter'),
            limit: z.number(),
        });
        const cmd = new Command();
        applyZodOptions(cmd, schema, { limit: 'Override limit description' });

        const statusOpt = cmd.options.find((o) => o.long === '--status');
        expect(statusOpt?.description).toBe('Status filter');

        const limitOpt = cmd.options.find((o) => o.long === '--limit');
        expect(limitOpt?.description).toBe('Override limit description');
    });

    it('should apply default values where provided', () => {
        const schema = z.object({
            verbose: z.boolean().default(false),
            retries: z.number().default(3),
            format: z.string().default('json'),
        });
        const cmd = new Command();
        applyZodOptions(cmd, schema);

        const verboseOpt = cmd.options.find((o) => o.long === '--verbose');
        expect(verboseOpt?.defaultValue).toBe(false);

        const retriesOpt = cmd.options.find((o) => o.long === '--retries');
        expect(retriesOpt?.defaultValue).toBe(3);

        const formatOpt = cmd.options.find((o) => o.long === '--format');
        expect(formatOpt?.defaultValue).toBe('json');
    });
});
