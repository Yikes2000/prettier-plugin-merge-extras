import { Fixture, runTest } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--preserve-eol-marker';
const name = 'align double slash';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) basic`,
        input: `\
//---------------------------------------- (1)

    ///
    a = true; // one
    foo = "bar"; // two
    c = 3; // three

    dd = 0; // four ///
    eee = "eee"; // five
    f = 123; // six
    //
    gone = "home"; // seven ///
    h = "hi"; // eight

    i = i; // nine
    jj = jj; // ten
`,
        output: `\
//---------------------------------------- (1)

              ///
a = true;     // one
foo = "bar";  // two
c = 3;        // three

dd = 0;       // four ///
eee = "eee";  // five
f = 123;      // six
              //
gone = "home";  // seven ///
h = "hi";       // eight

i = i; // nine
jj = jj; // ten
`
    },
    {
        name: `${name} (2) ternary`,
        input: `\
//---------------------------------------- (2)

msg = ///
      a < 5 ? "too small"   // one
    : a > 5 ? "too big"     // two
    :         "just right"; // three

msg = a < 100     // one ///
    ? "too low" // two
    : "...enough"; // three
`,
        output: `\
//---------------------------------------- (2)

msg =                        ///
      a < 5 ? "too small"    // one
    : a > 5 ? "too big"      // two
    :         "just right";  // three

msg = a < 100       // one ///
    ? "too low"     // two
    : "...enough";  // three
`,
    },
    {
        name: `${name} (3) triple slash equal "///="`,
        input: `\
//---------------------------------------- (3)

    ///=
    a = true; // one
    foo = "bar"; // two
    c = 3; // three

    dd = 0; // four ///=
    eee = "eee"; // five
    f = 123; // six
    //
    gone = "home"; // seven ///=
    h = "hi"; // eight

    i = i; // nine
    jj = jj; // ten
`,
        output: `\
//---------------------------------------- (3)

              ///=
a = true;     // one
foo = "bar";  // two
c = 3;        // three

dd  = 0;      // four ///=
eee = "eee";  // five
f   = 123;    // six
              //
gone = "home";  // seven ///=
h    = "hi";    // eight

i = i; // nine
jj = jj; // ten
`
    },
    {
        name: `${name} (4) nested`,
        input: `\
//---------------------------------------- (4)
if (cond) {
    if (cond) {
        ///
        a = true; // one
        foo = "bar"; // two
        c = 3; // three
    } else {
        dd = 0; // four ///
        eee = "eee"; // five
        f = 123; // six
        //
        gone = "home"; // seven ///
        h = "hi"; // eight

        i = i; // nine
        jj = jj; // ten
    }
}
`,
        output: `\
//---------------------------------------- (4)
if (cond) {
    if (cond) {
                      ///
        a = true;     // one
        foo = "bar";  // two
        c = 3;        // three
    } else {
        dd = 0;       // four ///
        eee = "eee";  // five
        f = 123;      // six
                      //
        gone = "home";  // seven ///
        h = "hi";       // eight

        i = i; // nine
        jj = jj; // ten
    }
}
`
    },
    
];

runTest({ desc, parser, fixtures });
