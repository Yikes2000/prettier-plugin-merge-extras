import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--align-object-properties';
const name = 'nesting';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) basic nesting`,
        input: `\
//---------------------------------------- (1)
const a = {
    b: true,
    cc: 2,
    ddd: {
        ee: [1, 2],
        ffff: { a: 1 },
        k: "k",
    },
    l: "long",
};
`,
        output: `\
//---------------------------------------- (1)
const a = {
    b   : true,
    cc  : 2,
    ddd : {
        ee   : [1, 2],
        ffff : { a: 1 },
        k    : "k",
    },
    l : "long",
};
`,
    },
    {
        name: `${name} (2) deeper nesting`,
        input: `\
//---------------------------------------- (2)
const a = {
    b: true,
    cc: 2,
    ddd: {
        ee: [1, 2],
        ffff: { a: 1 },
        g: {
            g1: 1,
            g2: 2,
            gg: "game",
        },
        h: {
            i: "i",
            j: "j",
        },
        k: "k",
    },
    l: "long",
};
`,
        output: `\
//---------------------------------------- (2)
const a = {
    b   : true,
    cc  : 2,
    ddd : {
        ee   : [1, 2],
        ffff : { a: 1 },
        g    : {
            g1 : 1,
            g2 : 2,
            gg : "game",
        },
        h : {
            i : "i",
            j : "j",
        },
        k : "k",
    },
    l : "long",
};
`,
    },
];

runTestAlign({ desc, parser, fixtures });
