import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--return-parentheses';
const name = 'return parentheses';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) preserve multi-line`,
        input: `\
//---------------------------------------- (1)
function sum() {
    return sum(
               sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
               sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
           ) + 1;
}
`,
        output: `\
//---------------------------------------- (1)
function sum() {
    return sum(
        sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
        sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
    ) + 1;
}
`,
    },
    {
        name: `${name} (1.1) continued expression`,
        input: `\
//---------------------------------------- (1.1)
function sum() {
    return foo("abcd.efgh").bar() &&
        sum(
            sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
            sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
        ) + 1;
}
`,
    },
    {
        name: `${name} (1.2) method chain onto second line`,
        input: `\
//---------------------------------------- (1.2)
function sum() {
    return foo().bar()
        .sum(
            sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
            sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
        ) + 1;
}
`,
    },
    {
        name: `${name} (2) strip parentheses`,
        input: `\
//---------------------------------------- (2)
function sum() {
    return (
        sum(
           sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
           sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
        ) + 2
    );
}
`,
        output: `\
//---------------------------------------- (2)
function sum() {
    return sum(
        sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
        sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
    ) + 2;
}
`,
    },
    {
        name: `${name} (3) multiple returns`,
        input: `\
//---------------------------------------- (3)
function sumA() {
    return sum(
               sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
               sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
           ) + 3;
}

function sumB() {
    return sum(
    sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
    sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
    ) + 4;
}
`,
        output: `\
//---------------------------------------- (3)
function sumA() {
    return sum(
        sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
        sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
    ) + 3;
}

function sumB() {
    return sum(
        sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
        sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
    ) + 4;
}
`,
    },
    {
        name: `${name} (-1) off`,
        options: {returnParentheses: true},
        input: `\
//---------------------------------------- (-1)
function sum() {
    return sum(
               sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
               sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
           ) - 1;
}
`,
        output: `\
//---------------------------------------- (-1)
function sum() {
    return (
        sum(
            sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
            sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
        ) - 1
    );
}
`
    },
];

runTestAlign({ desc, parser, fixtures });
