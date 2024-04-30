# prettier-plugin-merge-preserve

(Fork of Hyeonjong's [prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge).)

A Prettier plugin for preserving lines, in addition to the functionality of 
[prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge).

```
    Preserve first blank line of a block:     An expression:

        if (condition) {                          matrix = [  //
                                                      1, 0, 1,
          statement1;                                 0, 1, 0,
          statement2;                                 0, 0, 1,
                                                  ];
          statement3;
          statement4;
        }

    Preserve method chain breaks:

        cy.get("something")
          .style().isBold()
          .value().matches('abc')
          .hasAttribute({
              name: "explanation",
              xyz: true
          })
          .done();
```
.


## Installation

For Prettier v2:

```sh
npm install -D prettier@^2 @yikes2000/prettier-plugin-preserve-line
```

For Prettier v3:[^1]

```sh
npm install -D prettier @yikes2000/prettier-plugin-preserve-line
```
.


## Configuration

JSON example:

```json
{
  "plugins": ["@yikes2000/prettier-plugin-preserve-line"]
}
```

JS example (CommonJS module):

```javascript
module.exports = {
  plugins: ['@yikes2000/prettier-plugin-preserve-line'],
  preserveFirstBlankLine: true,
  preserveEolMarker: true,
};
```

JS example (ES module):

```javascript
export default {
  plugins: ['@yikes2000/prettier-plugin-preserve-line'],
  preserveFirstBlankLine: true,
  preserveEolMarker: true,
};
```
.

## Options

### Preserve First Blank Line

Preserve the first blank line of a block (curly, bracket, or parenthesis).

Example:
```
  if (condition) {

    statement1;
    statement2;

    statement3;
    statement4;
  }

  a = [

    // Odds
    1, 3, 5, 7, 9,

    // Evens
    2, 4, 6, 8, 10,
  ];

  sum = (

    // Odds
    1 + 3 + 5 + 7 + 9 +

    // Evens
    2 + 4 + 6 + 8 + 10
  );
```
<!-- prettier-ignore -->
Default | CLI&nbsp;Override | API&nbsp;Override
--- | --- | ---
`true` | `--no-preserve-first-blank-line` | `preserveFirstBlankLine: <bool>`

.

### Preserve Last Blank Line

Preserve the last blank line of a block (curly, bracket, or parenthesis).

Example:
```
  if (condition) {
    statement1;
    statement2;

  }

  a = [
    // Odds
    1, 3, 5, 7, 9,

    // Evens
    2, 4, 6, 8, 10,

  ];

  sum = (
    // Odds
    1 + 3 + 5 + 7 + 9 +

    // Evens
    2 + 4 + 6 + 8 + 10

  );
```
<!-- prettier-ignore -->
Default | CLI&nbsp;Override | API&nbsp;Override
--- | --- | ---
`true` | `--no-preserve-last-blank-line` | `preserveLastBlankLine: <bool>`

.

### Preserve by EOL Marker

End-of-line "//" marker applies "// prettier-ignore" to that line.

Example:
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
<!-- prettier-ignore -->
Default | CLI&nbsp;Override | API&nbsp;Override
--- | --- | ---
`true` | `--no-preserve-eol-marker` | `preserveEolMarker: <bool>`

.

### Preserve Method Chain Breaks

Prettier formats method chain in one of two styles:
```
  cy.all().in().one().line();

  cy.tooManyForOneLine()
    .split()
    .them()
    .into()
    .multiple()
    .lines();
```

This option preserves existing method chain breaks:
```
  cy.get("something")
    .value().matches('abc').matches('cde')
    .allowing({
        name: "explanation",
        xyz: true
    }).andMore()
    .done();
```
(Indentation is still handled by Prettier.)

For local exceptions, prepend "// no-preserve" line:
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
Prettier will format the line block after "// no-preserve".

<!-- prettier-ignore -->
Default | CLI&nbsp;Override | API&nbsp;Override
--- | --- | ---
`true` | `--no-preserve-dot-chain` | `preserveDotChain: <bool>`

.

## Compatibility with other Prettier plugins

See [prettier-plugin-merge-preserve](https://github.com/yikes2000/prettier-plugin-merge-preserve).

This plugin must be positioned last, replacing `prettier-plugin-merge`.

JSON example:
<!-- prettier-ignore -->
```json
{
  "plugins": [
    "prettier-plugin-tailwindcss",
    "prettier-plugin-classnames",
    "@yikes200/prettier-plugin-merge-preserve"
  ]
}
```

JS example (CommonJS module):
```javascript
module.exports = {
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-brace-style',
    '@yikes2000/prettier-plugin-merge-preserve',
  ],
  braceStyle: 'stroustrup',
};
```
.


## Limitations

<!-- prettier-ignore -->
Language | Supported | Notes
--- | --- | ---
Javascript | Yes |
Typescript | Yes |

Seeking contributors to support additional languages.

These preserve-line options are implemented using RegExp, which is the simplest but hacky way to achieve these results
considering the rigid complexity of Prettier's internal parser and AST format. In a few rare situations these preserve
options won't work, due to the limit of this RegExp approach.  Please kindly report them regardless.

.

## Credits

This plugin is a fork of Hyeonjong's [prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge).
