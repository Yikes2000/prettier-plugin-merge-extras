import { Fixture, runTest } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--preserve-eol-marker';
const name = 'align assignment';

const alignColon = { alignObjectProperties: 'colon' };

const fixtures: Fixture[] = [
    {
        name: `(${parser}) ${name} (1) basics`,
        options: alignColon,
        input: `\
//---------------------------------------- (1)
class Foo {
    private a1: boolean;          //:
    protected a2: string[];
    public a3: string;

    b: string;          //:
    cc: string;
    ddd: {
        d1: number;
        d22: number;
    };
    e: boolean;

    foo: string;
}
`,
        output: `\
//---------------------------------------- (1)
class Foo {
    private a1   : boolean;          //:
    protected a2 : string[];
    public a3    : string;

    b   : string;          //:
    cc  : string;
    ddd : {
        d1  : number;
        d22 : number;
    };
    e: boolean;

    foo: string;
}
`
    },
    {
        name: `${name} (2) by value`,
        options: { alignObjectProperties: 'value' },
        input: `\
//---------------------------------------- (2)
class Foo {
    private a1: boolean;          //:
    protected a2: string[];
    public a3: string;

    b: string;          //:
    cc: string;
    ddd: {
        d1: number;
        d22: number;
    };
    e: boolean;

    foo: string;
}
`,
        output: `\
//---------------------------------------- (2)
class Foo {
    private a1:   boolean;          //:
    protected a2: string[];
    public a3:    string;

    b:   string;          //:
    cc:  string;
    ddd: {
        d1:  number;
        d22: number;
    };
    e: boolean;

    foo: string;
}
`
    },
    {
        name: `${name} (3) off, alignObjectProperties="none"`,
        options: { alignObjectProperties: 'none' },
        input: `\
//---------------------------------------- (3)
class Foo {
    private a1: boolean; //:
    protected a2: string[];
    public a3: string;

    b: string; //:
    cc: string;
    ddd: {
        d1: number;
        d22: number;
    };
    e: boolean;

    foo: string;
}
`,
    },
    {
        name: `${name} (4) off, preserveEolMarker=false`,
        options: { ...alignColon, preserveEolMarker: false },
        input: `\
//---------------------------------------- (4)
class Foo {
    private a1: boolean; //:
    protected a2: string[];
    public a3: string;

    b: string; //:
    cc: string;
    ddd: {
        d1: number; // alignObjectProperties="colon"
        d22: number;
    };
    e: boolean;

    foo: string;
}
`,
        output: `\
//---------------------------------------- (4)
class Foo {
    private a1: boolean; //:
    protected a2: string[];
    public a3: string;

    b: string; //:
    cc: string;
    ddd: {
        d1  : number; // alignObjectProperties="colon"
        d22 : number;
    };
    e: boolean;

    foo: string;
}
`,
    },
];

runTest({ desc, parser, fixtures });
