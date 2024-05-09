import { Fixture, runTest } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--preserve-last-blank-line';
const name = 'curly block';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) no-op`,
        input: `\
//---------------------------------------- (1)

function a() {
    const a1 = {
        x: 1, // force multi-line
        y: 2,
    };

    if (a1) {
        statement;
    }

    try {
        statement;
    } catch (e) {
        statement;
    }
}
`,
    },
    {
        name: `${name} (2) activated`,
        input: `\
//---------------------------------------- (2)

function a() {
    const a1 = {
        x: 1, // force multi-line
        y: 2,

    };

    if (a1) {
        statement;

    }

    try {
        statement;

    } catch (e) {
        statement;

    }

}
`,
    },
    {
        name: `${name} (3) off`,
        options: {preserveLastBlankLine: false},
        input: `\
//---------------------------------------- (3)

function a() {
    const a1 = {
        x: 1, // force multi-line
        y: 2,

    };

    if (a1) {
        statement;

    }

    try {
        statement;

    } catch (e) {
        statement;

    }

}
`,
        output: `\
//---------------------------------------- (3)

function a() {
    const a1 = {
        x: 1, // force multi-line
        y: 2,
    };

    if (a1) {
        statement;
    }

    try {
        statement;
    } catch (e) {
        statement;
    }
}
`
    },
];

runTest({ desc, parser, fixtures });
