import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--merge-imports';
const name = 'basics';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) n/a`,
        input: `\
//---------------------------------------- (1)
import { a, b } from "foo";
import { c } from "bar";
`,
    },
    {
        name: `${name} (2) basic`,
        input: `\
//---------------------------------------- (2)
import { a, b } from "foo";
import { c } from "foo";
import { d } from "bar";

function foo() {
    statement;
}
`,
        output: `\
//---------------------------------------- (2)
import { a, b, c } from "foo";
import { d } from "bar";

function foo() {
    statement;
}
`,
    },
    {
        name: `${name} (3) multi-line`,
        input: `\
//---------------------------------------- (1)
import { alpha, bravo } from "foo";
import { charlie } from "foo";
import { delta } from "foo";
import { echoLongLongLongLong } from "foo";
import { foxtrotLongLongLongLong } from "foo";
import { d } from "bar";

function foo() {
    statement;
}
`,
        output: `\
//---------------------------------------- (1)
import {
    alpha,
    bravo,
    charlie,
    delta,
    echoLongLongLongLong,
    foxtrotLongLongLongLong,
} from "foo";
import { d } from "bar";

function foo() {
    statement;
}
`
    },
];

runTestAlign({ desc, parser, fixtures });
