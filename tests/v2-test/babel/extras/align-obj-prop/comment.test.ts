import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--align-object-properties';
const name = '';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) inline comment`,
        input: `\
//---------------------------------------- (1)
const a = {
    b: true,
    cc: 2,
    // inline comments are not formatted
    // const a = {
    //     b: true,
    //     cc: 2,
    // };
};
`,
        output: `\
//---------------------------------------- (1)
const a = {
    b  : true,
    cc : 2,
    // inline comments are not formatted
    // const a = {
    //     b: true,
    //     cc: 2,
    // };
};
`
    },
    {
        name: `${name} (2) C-style comment`,
        input: `\
//---------------------------------------- (2)
const a = {
    b: true,
    cc: 2,
    /**
     * C-style comments are not formatted
     * const a = {
     *     b: true,
     *     cc: 2,
     * };
     */
};
`,
        output: `\
//---------------------------------------- (2)
const a = {
    b  : true,
    cc : 2,
    /**
     * C-style comments are not formatted
     * const a = {
     *     b: true,
     *     cc: 2,
     * };
     */
};
`
    },
    {
        name: `${name} (3) corner case in array`,
        input: `\
//---------------------------------------- (3)
const a = [
    // comment
    {
        b: true,
        cc: 2,
    },
];
`,
        output: `\
//---------------------------------------- (3)
const a = [
    // comment
    {
        b  : true,
        cc : 2,
    },
];
`
    },
];

runTestAlign({ desc, parser, fixtures });
