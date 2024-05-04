import { Fixture, runTest } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--preserve-last-blank-line';
const name = 'parentheses block';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) no-op`,
        input: `\
//---------------------------------------- (1)

foo(
    // force
    arg1,
    arg2,

    arg3,
);
`,
    },
    {
        name: `${name} (2) activated`,
        input: `\
//---------------------------------------- (2)

foo(
    // force
    arg1,
    arg2,

    arg3,

);

bar(
    // force
    arg1,
    arg2,

);
`,
    },
    {
        name: `${name} (3) off`,
        options: {preserveLastBlankLine: false},
        input: `\
//---------------------------------------- (3)

foo(
    // force
    arg1,
    arg2,

);
`,
        output: `\
//---------------------------------------- (3)

foo(
    // force
    arg1,
    arg2,
);
`
    },
];

runTest({ desc, parser, fixtures });
