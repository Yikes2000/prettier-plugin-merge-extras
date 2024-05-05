import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--align-object-properties';
const name = '';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) plain function`,
        input: `\
//---------------------------------------- (1)
function a() {
    b: number = 1;

    c = {
        d: "door", // force multi-line
        ee: true,
    };

    function e() {
        f: number = 2;

        g = {
            h: "home", // force multi-line
            ee: true,
        };
    }
}
`,
        output: `\
//---------------------------------------- (1)
function a() {
    b: number = 1;

    c = {
        d  : "door", // force multi-line
        ee : true,
    };

    function e() {
        f: number = 2;

        g = {
            h  : "home", // force multi-line
            ee : true,
        };
    }
}
`
    },
    {
        name: `${name} (2) arrow function`,
        input: `\
//---------------------------------------- (2)
a = () => {
    b: number = 1;

    c = {
        d: "door", // force multi-line
        ee: true,
    };

    e = () => {
        f: number = 2;

        g = {
            h: "home", // force multi-line
            ee: true,
        };
    };
};
`,
        output: `\
//---------------------------------------- (2)
a = () => {
    b: number = 1;

    c = {
        d  : "door", // force multi-line
        ee : true,
    };

    e = () => {
        f: number = 2;

        g = {
            h  : "home", // force multi-line
            ee : true,
        };
    };
};
`,
    },
    {
        name: `${name} (3) multiple parameters`,
        input: `\
//---------------------------------------- (3)
function a(
    foo, // force multi-line
    bar,
) {
    b: number = 1;

    c = {
        d: "door", // force multi-line
        ee: true,
    };

    function e(
        foo, // force multi-line
        bar,
    ) {
        f: number = 2;

        g = {
            h: "home", // force multi-line
            ee: true,
        };
    }
}
`,
        output: `\
//---------------------------------------- (3)
function a(
    foo, // force multi-line
    bar,
) {
    b: number = 1;

    c = {
        d  : "door", // force multi-line
        ee : true,
    };

    function e(
        foo, // force multi-line
        bar,
    ) {
        f: number = 2;

        g = {
            h  : "home", // force multi-line
            ee : true,
        };
    }
}
`,
    },
    {
        name: `${name} (4) function return`,
        input: `\
//---------------------------------------- (4)
function a() {
    statement;
    statement;

    function e() {
        statement;

        return {
            h: "home", // force multi-line
            ee: true,
        };
    }

    return {
        b: 1, // force multi-line
        cc: "copy",
    };
}
`,
        output: `\
//---------------------------------------- (4)
function a() {
    statement;
    statement;

    function e() {
        statement;

        return {
            h  : "home", // force multi-line
            ee : true,
        };
    }

    return {
        b  : 1, // force multi-line
        cc : "copy",
    };
}
`
    },
];

runTestAlign({ desc, parser, fixtures });
