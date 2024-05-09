import { Fixture, runTest } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--preserve-first-blank-line';
const name = 'other symbols';

const width40 = { printWidth: 40 };

const fixtures: Fixture[] = [
    {
        name: `${name} (1) no-op`,
        options: width40,
        input: `\
//---------------------------------------- (1)

const abcDefGhiJklMnoPrsTuvWxyz =
    (condABC && condDEF) ||
    (condGHI && condJKL);

switch (abcDefGhiJklMnoPrsTuvWxyz) {
    case condABC:
        statement;
        break;
    case condDEF:
        statement;
        break;
}
`,
    },
    {
        name: `${name} (2) activated`,
        options: width40,
        input: `\
//---------------------------------------- (2)

const abcDefGhiJklMnoPrsTuvWxyz =

    (condABC && condDEF) ||

    (condGHI && condJKL);

switch (abcDefGhiJklMnoPrsTuvWxyz) {
    case condABC:

        statement;
        break;
    case condDEF:

        statement;
        break;
}
`,
    },
    {
        name: `${name} (3) off`,
        options: { ...width40, preserveFirstBlankLine: false },
        input: `\
//---------------------------------------- (3)

const abcDefGhiJklMnoPrsTuvWxyz =

    (condABC && condDEF) ||

    (condGHI && condJKL);

switch (abcDefGhiJklMnoPrsTuvWxyz) {
    case condABC:

        statement;
        break;
    case condDEF:

        statement;
        break;
}
`,
        output: `\
//---------------------------------------- (3)

const abcDefGhiJklMnoPrsTuvWxyz =
    (condABC && condDEF) ||
    (condGHI && condJKL);

switch (abcDefGhiJklMnoPrsTuvWxyz) {
    case condABC:
        statement;
        break;
    case condDEF:
        statement;
        break;
}
`
    },
    {
        name: `${name} (4) with comments`,
        options: width40,
        input: `\
//---------------------------------------- (4)

const abcDefGhiJklMnoPrsTuvWxyz =

    // comment
    (condABC && condDEF) ||

    // comment
    (condGHI && condJKL);

switch (abcDefGhiJklMnoPrsTuvWxyz) {
    case condABC:

        // comment
        statement;
        break;
    case condDEF:

        // comment
        statement;
        break;
}
`,
    },
    
];

runTest({ desc, parser, fixtures });
