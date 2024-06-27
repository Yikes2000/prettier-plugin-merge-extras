# prettier-plugin-merge-extras

A prettier plugin for less-opinionated options -- a fork of [prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge) by necessity.

```
    Align properties of object literals:

        a = {
            id   : 1,
            name : 'alpha'
            foo  : true,
        }

    Preserve first or last blank line of a block:

        if (condition) {

          statement1;
          statement2;

        }

    End-of-line "//" as "// prettier-ignore":

        matrix = [  //
            1, 0, 1,
            0, 1, 0,
            0, 0, 1,
        ];

    Preserve method chain breaks:

        cy.get("something")
          .style().isBold().notItalic()
          .hasAttribute({
              name: "explanation",
              xyz: true
          })
          .done();

    Return without parentheses:

        return <div>
            <div>Hello world!</div>
        </div>;
```

## Installation

For Prettier v2:

```sh
npm install -D prettier@^2 @yikes2000/prettier-plugin-merge-extras
```

For Prettier v3:[^1]

```sh
npm install -D prettier @yikes2000/prettier-plugin-merge-extras
```

## Configuration

JSON example:

```json
{
  "plugins": ["@yikes2000/prettier-plugin-merge-extras"]
}
```

JS example (CommonJS module):

```javascript
module.exports = {
  plugins: ['@yikes2000/prettier-plugin-merge-extras'],
};
```

JS example (ES module):

```javascript
export default {
  plugins: ['@yikes2000/prettier-plugin-merge-extras'],
};
```

## Options

### Align Object Properties

Align properties of object literals.

Group consecutive lines of properties and inline comments for alignment:

```
  const a = {
    be  : true,
    cat : 123,

    door  : "knob",
    // inline comment, continues group
    extra : true,

    east : 123,
    foo  : [
        // multi-line, breaks group
        1, 2, 3,
    ],
    g : "new group",
    h : "hi",
  }
```

Alignment options: 'colon' (default), 'value', 'none'

```
  Align by 'colon':            Algn by 'value':

    a = {                        a = {
        name   : 'foo',              name:   'foo',
        width  : 100,                width:  100,
        height : 20,                 height: 20,
    };                           };
```

<!-- prettier-ignore -->
Default | CLI&nbsp;Override | API&nbsp;Override
--- | --- | ---
`colon` | `--align-object-properties=none` | `alignObjectProperties: <string>`

See `preserveEolMarker` option about aligning '=' symbol for assignments.

### Align Single Property

Determine if single property has added white space padding:

```
  const a = {
    // force multi-line
    bar : true,
  }
```

Only applicable when `alignObjectProperties: "colon"`.

<!-- prettier-ignore -->
Default | CLI&nbsp;Override | API&nbsp;Override
--- | --- | ---
`true` | `--no-align-single-property` | `alignSingleProperty: <boolean>`

### Merge Imports

Merge simple imports:

```
  import { a, b } from 'foo';
  import { c } from 'foo';
  import { d } from 'foo';
  import { eee } from 'bar';

Merged:
  import { a, b, c, d } from 'foo';
  import { eee } from 'bar';
```

Supplement a missing functionality of `@trivago/prettier-plugin-sort-imports`.

<!-- prettier-ignore -->
Default | CLI&nbsp;Override | API&nbsp;Override
--- | --- | ---
`true` | `--no-merge-simple-imports` | `mergeSimpleImports: <bool>`

### Preserve Method Chain Breaks

Preserve existing method chain breaks:

```
  cy.get("something")
    .value().matches('abc').matches('cde')
    .allowing({
        name: "explanation",
        xyz: true
    }).andMore()
    .done();
```

(Indentation is handled by Prettier.)

Otherwise Prettier formats method chain in one of two styles:

```
  cy.all().in().one().line();

  cy.tooManyForOneLine()
    .split()
    .them()
    .into()
    .multiple()
    .lines();
```

Add "// no-preserve" to revert to Prettier format:

```
  // no-preserve
  cy.get("something").old().style();

  // no-preserve
  cy.get("something")
    .tooManyForOneLine()
    .one()
    .two()
    .three();
```

<!-- prettier-ignore -->
Default | CLI&nbsp;Override | API&nbsp;Override
--- | --- | ---
`true` | `--no-preserve-dot-chain` | `preserveDotChain: <bool>`

### Preserve by EOL Marker

End-of-line "//" marker applies "// prettier-ignore" to that line, e.g.

```
  matrix = [  //
    1, 0, 1,
    0, 1, 0,
    0, 0, 1,
  ];

  msg =  //
      matrix.length < 9 ? 'too smalt'
    : matrix.length > 9 ? 'too big'
    :                     'just right';
```

End-of-line "//=" marker aligns consecutive assignment lines:

```
  a   = true; //=
  bbb = 1;
  cc  = "ok";

  d = 4;
```

End-of-line "///" (triple slash) marker aligns '//' inline comments in consecutive lines:

```
  statement;  // step one ///
  a = 1;      // two
  cc = "ok";  // three
```

End-of-line "///=" performs both alignments:

```
  a   = true;  // one ///=
  bbb = 1;     // two
  cc  = "ok";  // three
```

End-of-line "//:" and "///:" are similar:

```
  class Foo {
    aa   : boolean; //:
    bbbb : string;

    c  : boolean;  // charlie  ///:
    dd : string;   // delta
  }
```

<!-- prettier-ignore -->
Default | CLI&nbsp;Override | API&nbsp;Override
--- | --- | ---
`true` | `--no-preserve-eol-marker` | `preserveEolMarker: <bool>`

### Preserve First Blank Line

Preserve the first blank line of a block (curly, bracket, or parenthesis), e.g.

```
  if (condition) {

    statement1;
    statement2;
  }

  a = [

    // Odds
    1, 3, 5, 7, 9,
  ];

  sum = (

    1 + 3 + 5 + 7 + 9
  );
```

<!-- prettier-ignore -->
Default | CLI&nbsp;Override | API&nbsp;Override
--- | --- | ---
`true` | `--no-preserve-first-blank-line` | `preserveFirstBlankLine: <bool>`

### Preserve Last Blank Line

Preserve the last blank line of a block (curly, bracket, or parenthesis), e.g.

```
  if (condition) {
    statement1;
    statement2;

  }
```

<!-- prettier-ignore -->
Default | CLI&nbsp;Override | API&nbsp;Override
--- | --- | ---
`true` | `--no-preserve-last-blank-line` | `preserveLastBlankLine: <bool>`

### Return Parentheses

Suppress the outer parentheses in multi-line return statement, e.g.

```
  return <div>
    <div>Hello world!</div>
  </div>;
```

<!-- prettier-ignore -->
Default | CLI&nbsp;Override | API&nbsp;Override
--- | --- | ---
`false` | `--return-parentheses` | `returnParentheses: <bool>`

## Compatibility with other Prettier plugins

This plugin must be positioned last, replacing [prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge).

JSON example:

<!-- prettier-ignore -->
```json
{
  "plugins": [
    "prettier-plugin-tailwindcss",
    "prettier-plugin-classnames",
    "@yikes200/prettier-plugin-merge-extras"
  ]
}
```

JS example (CommonJS module):

```javascript
module.exports = {
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-brace-style',
    '@yikes2000/prettier-plugin-merge-extras',
  ],
  braceStyle: 'stroustrup',
};
```

## Limitations

<!-- prettier-ignore -->
Language | Supported
--- | ---
Javascript | Yes, all options
Typescript | Yes, all options
Angular    | alignObjectProperties, alignSingleProperty

Welcome contributors to support additional languages.

This plugin's bonus options are implemented using RegExp, which is the simplest but hacky way to achieve these results,
considering Prettier's rigidity. In a few rare corner cases situations these preserve options won't work, due to the limit
of this RegExp approach. Please kindly report them regardless.

## Credits

This plugin is a fork of Hyeonjong's [prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge).
