import { Fixture, runTestAlign } from "../../../extras-run-test";
import { parser } from "../parser";

const desc = "--return-parentheses";
const name = "return parentheses";

const defaultOpts = {
    returnParentheses: false,
    preserveDotChain: true,
    semi: true,
};

const fixtures: Fixture[] = [
    {
        name: `${name} (1) no return parentheses, preserve dot-chain`,
        options: defaultOpts,
        input: `\
//---------------------------------------- (1)
function foo() {
    return spec()
        .use("gqlPost")
        .use("superUserAuth", { override: tokenOverride })
        .use("gqlQuery", {
            query : "...",
            variables,
            expectError,
        });
}
`,
    },
    {
        name: `${name} (1.1) no return parentheses, preserve dot-chain, no semi`,
        options: { ...defaultOpts, semi: false },
        input: `\
//---------------------------------------- (1.1)
function foo() {
    return spec()
        .use("gqlPost")
        .use("superUserAuth", { override: tokenOverride })
        .use("gqlQuery", {
            query : "...",
            variables,
            expectError,
        })
}
`,
    },
    {
        name: `${name} (2) return parentheses, preserve dot-chain`,
        options: { ...defaultOpts, returnParentheses: true },
        input: `\
//---------------------------------------- (2)
function foo() {
    return (
        spec()
            .use("gqlPost")
            .use("superUserAuth", { override: tokenOverride })
            .use("gqlQuery", {
                query : "...",
                variables,
                expectError,
            })
    );
}
`,
    },
    {
        name: `${name} (2.1) return parentheses, preserve dot-chain, no semi`,
        options: { ...defaultOpts, returnParentheses: true, semi: false },
        input: `\
//---------------------------------------- (2.1)
function foo() {
    return (
        spec()
            .use("gqlPost")
            .use("superUserAuth", { override: tokenOverride })
            .use("gqlQuery", {
                query : "...",
                variables,
                expectError,
            })
    )
}
`,
    },
];

runTestAlign({ desc, parser, fixtures });
