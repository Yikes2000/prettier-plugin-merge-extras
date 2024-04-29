# prettier-plugin-merge-preserve

(Fork of Hyeonjong's [prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge).)

This plugin adds format options to preserve special lines:

```
    Preserve first blank line of a block:            Preserve an expression:

        if (condition) {                                 matrix = [  //
                                                             1, 0, 1,
          statement1;                                        0, 1, 0,
          statement2;                                        0, 0, 1,
                                                         ];
          statement3;
          statement4;
        }
```


## Installation

For Prettier v2:

```sh
npm install -D prettier@^2 @yikes2000/prettier-plugin-merge-preserve
```

For Prettier v3:[^1]

```sh
npm install -D prettier @yikes2000/prettier-plugin-merge-preserve
```


## Configuration

JSON example:

```json
{
  "plugins": ["@yikes2000/prettier-plugin-merge-preserve"]
}
```

JS example (CommonJS module):

```javascript
module.exports = {
  plugins: ['@yikes2000/prettier-plugin-merge-preserve'],
  preserveFirstBlankLine: true,
  preserveDoubleSlashEol: true,
};
```

JS example (ES module):

```javascript
export default {
  plugins: ['@yikes2000/prettier-plugin-merge-preserve'],
  preserveFirstBlankLine: true,
  preserveDoubleSlashEol: true,
};
```


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

### Preserve by EOL Marker

End-of-line `//` marker will apply `// prettier-ignore` to that line.

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


## Compatibility with other Prettier plugins

If more than one Prettier plugin is applicable to a file type, Prettier will only execute the last plugin.

As a workaround, Hyeonjong's [prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge) as the last plugin
will apply other plugins sequentially and merge the results.

Then the work to preserve selective lines must be done outside of that sequence, hence this fork.

This plugin will work standalone, or as the last plugin:

JSON example:

<!-- prettier-ignore -->
```json
{
  "plugins": [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-brace-style",
    "@yikes2000/prettier-plugin-merge-preserve"
  ],
  "braceStyle": "stroustrup"
}

```


## Limitations

Language support for line preservation options: Javascript and Typescript.  Seeking contributors to support
additional languages.


## Credits

This plugin is a fork of Hyeonjong's [prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge).



