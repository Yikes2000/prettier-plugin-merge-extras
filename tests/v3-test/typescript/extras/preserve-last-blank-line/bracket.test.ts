import { Fixture, runTest } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--preserve-last-blank-line';
const name = 'bracket block';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) no-op`,
        input: `\
//---------------------------------------- (1)

const a = [
    1, 3, 5, 7, 9,

    // Evens
    2, 4, 6, 8, 10,
];
`,
    },
    {
        name: `${name} (2) activated`,
        input: `\
//---------------------------------------- (2)

const a = [
    1, 3, 5, 7, 9,

    // Evens
    2, 4, 6, 8, 10,

];

const b = [  // inline comment, must add EOL -> //
    // odd
    1, 3,

    // even
    2, 4,

];
`,
    },
    {
        name: `${name} (3) off`,
        options: {preserveLastBlankLine: false},
        input: `\
//---------------------------------------- (3)

const a = [
    1, 3, 5, 7, 9,

    // Evens
    2, 4, 6, 8, 10,

];

const b = [  // inline comment force to next line
    1, 2, 3,

];
`,
        output: `\
//---------------------------------------- (3)

const a = [
    1, 3, 5, 7, 9,

    // Evens
    2, 4, 6, 8, 10,
];

const b = [
    // inline comment force to next line
    1, 2, 3,
];
`
    },
];

runTest({ desc, parser, fixtures });
