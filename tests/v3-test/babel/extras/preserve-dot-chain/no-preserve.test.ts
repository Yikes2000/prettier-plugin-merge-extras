import { Fixture, runTest } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--preserve-dot-chain';
const name = 'no-preserve';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) no-preserve`,
        input: `\
a = "// ---------------------------------------- (1)";
a = ".... Why inline comment mess up test?!";

// no-preserve
cy.get("bar")
.check().this()
.value();
`,
        output: `\
a = "// ---------------------------------------- (1)";
a = ".... Why inline comment mess up test?!";

// no-preserve
cy.get("bar").check().this().value();
`
    },
    {
        name: `${name} (2) no-preserve mixed`,
        input: `\
a = "// ---------------------------------------- (2)";

cy.get("foo")
  .check().a().b()
.value();

// no-preserve
cy.get("bar")
.check().this()
.value();

cy.get("bat")
.check().aux()
.value();
`,
        output: `\
a = "// ---------------------------------------- (2)";

cy.get("foo")
    .check().a().b()
    .value();

// no-preserve
cy.get("bar").check().this().value();

cy.get("bat")
    .check().aux()
    .value();
`
    },
    {
        name: `${name} (3) multi-line`,
        input: `\
a = "// ---------------------------------------- (3)";

cy.get("foo")
    .check().a().b()
    .value();

// no-preserve
cy.get("bar")
    .check().multiline({
        desc: "something small",
        bar: true,
    }).more()
    .value().last();

cy.get("bar")
    .check().aux()
    .value();
`,
        output: `\
a = "// ---------------------------------------- (3)";

cy.get("foo")
    .check().a().b()
    .value();

// no-preserve
cy.get("bar")
    .check()
    .multiline({
        desc: "something small",
        bar: true,
    })
    .more()
    .value()
    .last();

cy.get("bar")
    .check().aux()
    .value();
`
    },
];

runTest({ desc, parser, fixtures });
