import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--return-parentheses';
const name = 'return parentheses';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) template literals`,
        input: `\
//---------------------------------------- (1)
function foo() {
    return \`

bar

\`;
}
`,
    },
    {
        name: `${name} (2) double-slash preserve`,
        input: `\
//---------------------------------------- (2)
function foo() {
    return bar( //
\`
abc 123
\`) + 1;
}
`,
    },
    {
        name: `${name} (3) consequence`,
        input: `\
//---------------------------------------- (3)
function foo() {
    return bar(
\`
abc 123
\`) + 1;
}
`,
        output: `\
//---------------------------------------- (3)
function foo() {
    return (
        bar(
            \`
abc 123
\`,
        ) + 1
    );
}
`,
    },
];

runTestAlign({ desc, parser, fixtures });
