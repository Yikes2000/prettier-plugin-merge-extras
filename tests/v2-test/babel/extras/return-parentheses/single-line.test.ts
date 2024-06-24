import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--return-parentheses';
const name = 'return parentheses';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) parentheses`,
        input: `\
//---------------------------------------- (1)
function sum() {
    return (1 + 2 + 3);
}
`,
        output: `\
//---------------------------------------- (1)
function sum() {
    return 1 + 2 + 3;
}
`,
    },
    {
        name: `${name} (2) no parentheses`,
        input: `\
//---------------------------------------- (2)
function sum() {
    return 1 + 2 + 3;
}
`,
    },
];

runTestAlign({ desc, parser, fixtures });
