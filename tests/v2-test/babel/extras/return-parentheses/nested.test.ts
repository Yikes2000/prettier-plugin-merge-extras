import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--return-parentheses';
const name = 'return parentheses';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) nested multi-line as-is`,
        input: `\
//---------------------------------------- (1)
function foo(bar) {
    return new Promise((resolve, reject) => {
        api.call({ param: 123 }, (result) => {
            return sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10) +
                sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        });
    }) === bar;
}
`,
    },
    {
        name: `${name} (2) nested multi-line`,
        input: `\
//---------------------------------------- (2)
function foo(bar) {
    return (
        new Promise((resolve, reject) => {
            api.call({ param: 123 }, (result) => {
                return (
                    sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10) +
                    sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
                );
            });
        }) === bar
    );
}
`,
        output: `\
//---------------------------------------- (2)
function foo(bar) {
    return new Promise((resolve, reject) => {
        api.call({ param: 123 }, (result) => {
            return sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10) +
                sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        });
    }) === bar;
}
`,
    }
    
];

runTestAlign({ desc, parser, fixtures });
