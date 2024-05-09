import { Fixture, runTest } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--preserve-eol-marker';
const name = 'ternary';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) n/a`,
        input: `\
//---------------------------------------- (1)

msg =
      a < 5 ? "too small"
    : a > 5 ? "too big"
    :         "just right";
`,
        output: `\
//---------------------------------------- (1)

msg = a < 5 ? "too small" : a > 5 ? "too big" : "just right";
`
    },
    {
        name: `${name} (2) preserve`,
        input: `\
//---------------------------------------- (2)

msg =  //
      a < 5 ? "too small"
    : a > 5 ? "too big"
    :         "just right";

msg = a < 100  //
    ? "too low"
    : "enough";
`,
    },
    {
        name: `${name} (3) off`,
        options: {preserveEolMarker: false},
        input: `\
//---------------------------------------- (3)

msg = a < 100  //
    ? "too low"
    : "enough";
`,
        output: `\
//---------------------------------------- (3)

msg =
    a < 100 //
        ? "too low"
        : "enough";
`
    },
];

runTest({ desc, parser, fixtures });
