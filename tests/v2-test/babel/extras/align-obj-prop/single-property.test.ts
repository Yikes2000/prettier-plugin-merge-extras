import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--align-single-property';
const name = 'single property';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) default true`,
        input: `\
//---------------------------------------- (1)
a = {
    b: true,
};

c = {
    d: true,
    ee: false,
};
`,
        output: `\
//---------------------------------------- (1)
a = {
    b : true,
};

c = {
    d  : true,
    ee : false,
};
`
    },
    {
        name: `${name} (2) false`,
        options: { alignSingleProperty: false },
        input: `\
//---------------------------------------- (2)
a = {
    b: true,
};

c = {
    d: true,
    ee: false,
};
`,
        output: `\
//---------------------------------------- (2)
a = {
    b: true,
};

c = {
    d  : true,
    ee : false,
};
`
    },
];

runTestAlign({ desc, parser, fixtures });
