import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--align-object-properties';
const name = 'property keys';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) basic interface`,
        input: `\
//---------------------------------------- (3)
interface a {
    bb   : boolean;
    c?   : number;
    "3"? : boolean;
    e    : number;
}
`,
    },
];

runTestAlign({ desc, parser, fixtures });
