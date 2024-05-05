import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--align-object-properties';
const name = 'backticks';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) basic`,
        input: `\
//---------------------------------------- (1)
const a = {
    b: true,
    cc: 2,
    d: \`
    e: "trick", // inside back-tick string, should ignore
\`,
    f: false,

    gg: "game",
    h: "\`",
    i: "handles single back-tick okay",
};
`,
        output: `\
//---------------------------------------- (1)
const a = {
    b  : true,
    cc : 2,
    d  : \`
    e: "trick", // inside back-tick string, should ignore
\`,
    f : false,

    gg : "game",
    h  : "\`",
    i  : "handles single back-tick okay",
};
`
    },
    {
        name: `${name} (2) corner fail`,
        input: `\
//---------------------------------------- (2)
const a = {
    b: true,
    cc: "\`",
    d: "bad luck, we can't handle this.",
    e: "\`",
    f: false,
};
`,
        output: `\
//---------------------------------------- (2)
const a = {
    b  : true,
    cc : "\`",
    d: "bad luck, we can't handle this.",
    e: "\`",
    f  : false,
};
`
    },
];

runTestAlign({ desc, parser, fixtures });
