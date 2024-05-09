import { Fixture, runTest } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--preserve-eol-marker';
const name = 'align assignment';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) basic`,
        input: `\
//---------------------------------------- (1)
    const a = true; //=
    foo = "bar";
    c = [
        d = 0,
        // multi-line
        1,
    ];
`,
        output: `\
//---------------------------------------- (1)
const a = true; //=
foo     = "bar";
c       = [
    (d = 0),
    // multi-line
    1,
];
`
    },
    {
        name: `${name} (2) grouping`,
        input: `\
//---------------------------------------- (2)
if (cond1) {
    a = true;
    foo = "bar";

    b = false;   //=
    bar = "abc";
    c = [
        d = 0,
        // multi-line
        1,
    ];
    defg = true;
    h = 4; //=
    ii = 5;
    jjj = 6; // start another group //=
    kk = 7;
}
`,
        output: `\
//---------------------------------------- (2)
if (cond1) {
    a = true;
    foo = "bar";

    b   = false;   //=
    bar = "abc";
    c   = [
        (d = 0),
        // multi-line
        1,
    ];
    defg = true;
    h  = 4; //=
    ii = 5;
    jjj = 6; // start another group //=
    kk  = 7;
}
`
    },
];

runTest({ desc, parser, fixtures });
