import { Fixture, runTest } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--preserve-eol-marker';
const name = 'array';

const fixtures: Fixture[] = [
    {
        name: `(${parser}) ${name} (1) n/a`,
        input: `\
//---------------------------------------- (1)

a = [
    1, 2, 3,
    4, 5, 6,
];
`,
        output: `\
//---------------------------------------- (1)

a = [1, 2, 3, 4, 5, 6];
`
    },
    {
        name: `${name} (2) preserve`,
        input: `\
//---------------------------------------- (2)

a = [ //
    1, 2, 3,
    4, 5, 6,
];

b = //
    [
        1, 2,
        3, 4,
        5, 6,
    ];
`,
    },
    {
        name: `${name} (3) off`,
        options: {preserveEolMarker: false},
        input: `\
//---------------------------------------- (3)

a = [ //
    1, 2, 3,
    4, 5, 6,
];
`,
        output: `\
//---------------------------------------- (3)

a = [
    //
    1, 2, 3, 4, 5, 6,
];
`
    },
];

runTest({ desc, parser, fixtures });
