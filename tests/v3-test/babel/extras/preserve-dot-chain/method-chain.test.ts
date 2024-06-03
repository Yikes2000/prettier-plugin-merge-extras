import { Fixture, runTest } from '../../../extras-run-test';
import { parser } from '../parser';

const desc = '--preserve-dot-chain';
const name = 'method chain';

const fixtures: Fixture[] = [
    {
        name: `${name} (1) no-op`,
        input: `\
//---------------------------------------- (1)

cy.get("foo").check().value();
`
    },
    {
        name: `${name} (2) no-op`,
        input: `\
//---------------------------------------- (2)

cy.get("foo").check().value().force().intoSeparateLines().onePerLine().one().two().three();
`,
        output: `\
//---------------------------------------- (2)

cy.get("foo")
    .check()
    .value()
    .force()
    .intoSeparateLines()
    .onePerLine()
    .one()
    .two()
    .three();
`
    },
    {
        name: `${name} (3) activated`,
        input: `\
a = "// ---------------------------------------- (3)";
a = ".... Why inline comment mess up test?!";

cy.get("foo")
    .check().a().b()
    .value();

cy.get("bar")
    .check().one().two().three().four().asLongAsDesired().wontBreakIntoMoreLines()
    .value().last();
`,
    },
    {
        name: `${name} (4) alignment`,
        input: `\
a = "// ---------------------------------------- (4)";

cy.get("foo")
        .check().a().b()
.value();

cy.get("bar")
 .check().one().two().three()
   .value().last();
`,
        output: `\
a = "// ---------------------------------------- (4)";

cy.get("foo")
    .check().a().b()
    .value();

cy.get("bar")
    .check().one().two().three()
    .value().last();
`
    },
    {
        name: `${name} (5) multi-line`,
        input: `\
a = "// ---------------------------------------- (5)";

cy.get("foo")
    .check().multiline({
        desc: "split method params into multiple lines",
        a: 123,
        b: true,
    })
    .value().last();

cy.get("bar")
    .check().multiline({
        desc: "something small",
        bar: true,
    }).more()
    .value().last();
`,
    },
    {
        name: `${name} (6) multi-line align`,
        input: `\
a = "// ---------------------------------------- (6)";

cy.get("foo")
    .check().multiline({
        desc: "multiple line split",
              a: 123,
           b: true,
  }).more()
.value().last();
`,
        output: `\
a = "// ---------------------------------------- (6)";

cy.get("foo")
    .check().multiline({
        desc: "multiple line split",
        a: 123,
        b: true,
    }).more()
    .value().last();
`,
    },
    {
        name: `${name} (7) chain on first line`,
        input: `\
a = "// ---------------------------------------- (7)";
a = ".... Why inline comment mess up test?!";

cy.get("foo").cook().serve()
    .check().a().b()
    .value();
`,
    },
    {
        name: `${name} (8) off`,
        options: {preserveDotChain: false},
        input: `\
a = "// ---------------------------------------- (8)";

cy.get("foo")
  .check().value();
`,
        output: `\
a = "// ---------------------------------------- (8)";

cy.get("foo").check().value();
`
    }
];

runTest({ desc, parser, fixtures });
