
Test separately against multiple versions of Prettier:

    tests    $ cd v2-test
    v2-test  $ pnpm i
    v2-test  $ npx vitest run babel/extras typescript/extras angular/extras

    tests    $ cd v3-test
    v3-test  $ pnpm i
    v3-test  $ npx vitest run babel/extras typescript/extras angular/extras


Babel (Javascript) tests:

    v3-test/babel/extras/

        align-obj-prop/
            back-ticks.test.ts
            comment.test.ts
            func-context.test.ts
            grouping.test.ts
            nesting.test.ts
            options.test.ts

        merge-imports/
            merge-imports.test.ts

        preser-dot-chain/
            ...

        preserve-eol-marker/
            array.test.ts
            ternary.test.ts

        preserve-first-blank-line/
            curly.test.ts
            bracket.test.ts
            parenthesis.test.ts

        preserve-last-blank-line/
            ...


Typescript and v2-test are copies of the above tests.

    v3-test/typescript/extras/
        cp_babel.sh

    v2-test/babel/extras/
        cp_v3_babel.sh

    v2-test/typescript/extras/
        cp_v3_typescript.sh

Run these *.sh in the above order to refresh those directories from v2-test/babel/extras.
