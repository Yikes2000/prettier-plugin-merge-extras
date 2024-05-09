import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--align-object-properties';
const name = 'EOL ignore';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) basic`,
        input: `\
//---------------------------------------- (1)
const a = { //
    b: {
        cc: true,
        d: 1,
    },
    ee: 2,
    f: {
        good: false,
        hi: 123,
    },
};

const x = {
    y: {
        zz: true,
        w: 1,
    },
};
`,
        output: `\
//---------------------------------------- (1)
const a = { //
    b: {
        cc: true,
        d: 1,
    },
    ee: 2,
    f: {
        good: false,
        hi: 123,
    },
};

const x = {
    y : {
        zz : true,
        w  : 1,
    },
};
`,
    },
];

runTestAlign({ desc, parser, fixtures });
