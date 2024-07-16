import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--align-object-properties';
const name = 'property keys';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) variations`,
        input: `\
//---------------------------------------- (1)
const a = {
    bbbb: true,
    _d: 2,
    [e]: 3,
    f_:  4,
    "g h": 5,
    "i:j": 6,
};
`,
        output: `\
//---------------------------------------- (1)
const a = {
    bbbb  : true,
    _d    : 2,
    [e]   : 3,
    f_    : 4,
    "g h" : 5,
    "i:j" : 6,
};
`,
    },
    {
        name: `${name} (2) computed property name`,
        input: `\
//---------------------------------------- (2)
const a = {
    bbbb: true,
    [c + ":d"]: 2,
    [\`\${c} : d\`]: 3,
};
`,
        output: `\
//---------------------------------------- (2)
const a = {
    bbbb         : true,
    [c + ":d"]   : 2,
    [\`\${c} : d\`] : 3,
};
`,
    },
    {
        name: `${name} (3) corner case`,
        input: `\
//---------------------------------------- (3)
const a = {
    "de-LI" : { format: \`12'345.67CHF\`, dec: "." },
    en      : { format: \`$12,345.67\`, dec: "." },
    "en-AU" : { format: \`$12,345.67\`, dec: "." },
};
`,
    },
];

runTestAlign({ desc, parser, fixtures });
