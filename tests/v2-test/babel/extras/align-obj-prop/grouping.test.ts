import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--align-object-properties';
const name = 'grouping';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) basic`,
        input: `\
//---------------------------------------- (1)
const a = {
    b: true,
    cc: 2,

    ddd: "door", // blank line breaks grouping
    ee: "extra",

    f: false,
    // group continuation with inline comment, spread, and property name shorthand
    ...spread,
    job,
    good: true,

    hi: "hi",
    i: 1,
    /* C-style comment breaks grouping */
    j: 2,
};
`,
        output: `\
//---------------------------------------- (1)
const a = {
    b  : true,
    cc : 2,

    ddd : "door", // blank line breaks grouping
    ee  : "extra",

    f    : false,
    // group continuation with inline comment, spread, and property name shorthand
    ...spread,
    job,
    good : true,

    hi : "hi",
    i  : 1,
    /* C-style comment breaks grouping */
    j : 2,
};
`
    },
    {
        name: `${name} (2) multi-line breaks grouping`,
        input: `\
//---------------------------------------- (2)
const a = {
    b: true,
    cc: 2,
    ddd: \`
backtick multi-line
\`,
    ee: "extra",
    f: {
        desc: "nested",
        txt: "a", // force multi-line object
        st: "b",
        msg: "cde",
    },
    ggg: "game",
    h: [
        "a", // force multi-line array
        "b",
        "c",
    ],
    index: true,
    j: () => {
        a:number = 1; // multi-line via function
    },
    key: true,
};
`,
        output: `\
//---------------------------------------- (2)
const a = {
    b   : true,
    cc  : 2,
    ddd : \`
backtick multi-line
\`,
    ee : "extra",
    f  : {
        desc : "nested",
        txt  : "a", // force multi-line object
        st   : "b",
        msg  : "cde",
    },
    ggg : "game",
    h   : [
        "a", // force multi-line array
        "b",
        "c",
    ],
    index : true,
    j     : () => {
        a: number = 1; // multi-line via function
    },
    key : true,
};
`,
    },
];

runTestAlign({ desc, parser, fixtures });
