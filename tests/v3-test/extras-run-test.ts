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
};

export function runTest(params: Params) {
    //
    const options = {
        ...baseOptions,
        tabWidth: 4,
        plugins: [thisPlugin],
        parser: params.parser,
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
