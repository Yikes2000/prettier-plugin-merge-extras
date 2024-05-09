import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--align-object-properties';
const name = 'options';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) none`,
        options: { alignObjectProperties: 'none' },
        input: `\
//---------------------------------------- (1)
const a = {
    b: true,
    foo: "abc",
    zz: 12,
};
`,
    },
    {
        name: `${name} (2) colon`,
        options: { alignObjectProperties: 'colon' },
        input: `\
//---------------------------------------- (2)
const a = {
    b: true,
    foo: "abc",
    zz: 12,
};
`,
        output: `\
//---------------------------------------- (2)
const a = {
    b   : true,
    foo : "abc",
    zz  : 12,
};
`,
    },
    {
        name: `${name} (3) value`,
        options: { alignObjectProperties: 'value' },
        input: `\
//---------------------------------------- (3)
const a = {
    b: true,
    foo: "abc",
    zz: 12,
};
`,
        output: `\
//---------------------------------------- (3)
const a = {
    b:   true,
    foo: "abc",
    zz:  12,
};
`,
    },
];

runTestAlign({ desc, parser, fixtures });
