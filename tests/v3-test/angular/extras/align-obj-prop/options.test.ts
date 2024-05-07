import { Fixture, runTestAlign } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--align-object-properties';
const name = 'options';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) none`,
        options: { alignObjectProperties: 'none' },
        input: `\
<!---------------------------------------- (1) -->
<div>
    <div
        [ngClass]="{
            b: true,
            foo: 'abc',
            zz: 12
        }"
    ></div>
</div>
`,
    },
    {
        name: `${name} (2) colon`,
        options: { alignObjectProperties: 'colon' },
        input: `\
<!---------------------------------------- (2) -->
<div>
    <div
        [ngClass]="{
            b: true,
            foo: 'abc',
            zz: 12,
        }"
    ></div>
</div>
`,
        output: `\
<!---------------------------------------- (2) -->
<div>
    <div
        [ngClass]="{
            b   : true,
            foo : 'abc',
            zz  : 12
        }"
    ></div>
</div>
`,
    },
    {
        name: `${name} (3) value`,
        options: { alignObjectProperties: 'value' },
        input: `\
<!---------------------------------------- (3) -->
<div>
    <div
        [ngClass]="{
            b: true,
            foo: 'abc',
            zz: 12,
        }"
    />
</div>
`,
        output: `\
<!---------------------------------------- (3) -->
<div>
    <div
        [ngClass]="{
            b:   true,
            foo: 'abc',
            zz:  12
        }"
    />
</div>
`,
    },
];

runTestAlign({ desc, parser, fixtures });
