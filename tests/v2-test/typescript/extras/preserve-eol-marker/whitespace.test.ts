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
//---------------------------------------- (3)
    a    =    true; //
    b          = 1;  //
    c =      "abc";   //
`,
        output: `\
//---------------------------------------- (3)
a    =    true; //
b          = 1;  //
c =      "abc";   //
`,
    },
    {

        name: `${name} (4) //: //= /// ///=`,
        input: `\
//---------------------------------------- (4)
if (cond) {
  a = true;      // extra space   //:
  b = false;          // more...

  foo = "bar";   //:

  a2 = true;      // extra space   //=
  c = false;          // more...

  foo2 = "bar";   //=

  a3 = true;      // extra space   ///
  d = false;          // more...

  foo3 = "bar";   ///

  a4 = true;      // extra space   ///=
  e = false;          // more...

  foo4 = "bar";   ///=
}
`,
        output: `\
//---------------------------------------- (4)
if (cond) {
    a = true;      // extra space   //:
    b = false; // more...

    foo = "bar";   //:

    a2 = true;      // extra space   //=
    c  = false; // more...

    foo2 = "bar";   //=

    a3 = true;  // extra space   ///
    d = false;  // more...

    foo3 = "bar";  ///

    a4 = true;   // extra space   ///=
    e  = false;  // more...

    foo4 = "bar";  ///=
}
`
    },
];

runTest({ desc, parser, fixtures });
