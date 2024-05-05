import { format } from 'prettier';
import { describe, expect, test } from 'vitest';

import * as thisPlugin from '@/packages/v3-plugin';
import { baseOptions } from '../test-settings';

export type Fixture = {
    name: string;
    input: string;
    output?: string;  // if not given, use 'input'
    options?: NodeJS.Dict<unknown> & Partial<typeof baseOptions>;
};

export type Params = {
    desc: string;
    parser: string;
    fixtures: Fixture[];
    options?: any;
};

export function runTestAlign(params: Params) {
  // Run align-obj-props tests with default alignObjectProperties set to 'colon'
  runTest({ ...params, options: { alignObjectProperties: 'colon' } });
}

export function runTest(params: Params) {
    //
    const options = {
        ...baseOptions,
        plugins: [thisPlugin],
        parser: params.parser,

        tabWidth: 4,
        alignObjectProperties: 'none',
        ...(params.options ?? {}),
    };

    describe(params.desc, () => {
        for (const fixture of params.fixtures) {
            describe(fixture.name, () => {
                //
                const promise = format(fixture.input, {
                    ...options,
                    ...(fixture.options ?? {}),
                });

                test('format correctly', async () => {
                    expect(await promise).toBe(fixture.output || fixture.input);
                });
            });
        }
    });
}
