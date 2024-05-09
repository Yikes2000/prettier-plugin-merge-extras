import { Fixture, runTest } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--preserve-eol-marker';
const name = 'whitespace';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) extra space`,
        input: `\
//---------------------------------------- (1)
a = true;      // extra space   //
foo = "bar";   // also here     //
`,
        output: `\
//---------------------------------------- (1)
a = true;      // extra space   //
foo = "bar";   // also here     //
`
    },
    {
        name: `${name} (2) 1, 2, 3 space`,
        input: `\
//---------------------------------------- (2)
a    =    true; //
b          = 1;  //
c =      "abc";   //
`,
    },
    {
        name: `${name} (3) still indents`,
        input: `\
//---------------------------------------- (2)
    a    =    true; //
    b          = 1;  //
    c =      "abc";   //
`,
        output: `\
//---------------------------------------- (2)
a    =    true; //
b          = 1;  //
c =      "abc";   //
`,
    },
];

runTest({ desc, parser, fixtures });
