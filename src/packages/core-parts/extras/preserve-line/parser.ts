import type { ParserOptions, Plugin } from 'prettier';

interface PreserveLineOptions {
  preserveFirstBlankLine?: boolean;
  preserveLastBlankLine?: boolean;
  preserveEolMarker?: boolean;
  preserveDotChain?: boolean;
};

/**
 * 'preserve-first-blank-line' is accomplished by replacing the first empty line in an open block with a marker comment
 * in pre-process, e.g.
 *
 *      if (something) {
 *          //__BR__
 *          ...
 *
 * Then the code is formatted by Prettier, after which the marker is removed in post-process.
 */
const RE_OPEN_BLANK_LINE = new RegExp(/([\{\[\(=:|&]\s*\n)(?:\s*\n)+/g);

const BR = '//__BR__';
const RE_BR_LINE = new RegExp(`[ ]*${BR}$`, 'mg');  // for post-process

/**
 * 'preserve-last-blank-line' replaces the last empty line a close block with a marker comment in pre-process, e.g.
 *
 *     if (condition) {
 *         ...
 *         //__BR__
 *     }
 *
 * After Prettier formats the code, then the marker is removed in post-process.
 */
const RE_CLOSE_BLANK_LINE = new RegExp(/(?<=\n)(?:\s*\n)+(\s*[\}\]\)])/g);

/**
 * End-of-line '//' alias for '// prettier-ignore' on the previous line is added during pre-process, e.g.
 *
 *     // prettier-ignore
 *     matrix = [   //
 *         1, 0, 0,
 *         0, 1, 0,
 *         0, 0, 1
 *     ];
 *
 * Then prettier-ignore line is removed in post-process.
 */
const IGNORE = '// prettier-ignore';
const RE_DOUBLE_SLASH_EOL = new RegExp(/^(.*\/\/)$/mg);
const RE_DBL_SLASH_PRESERVE_SPACE = new RegExp(/(?<=\S)[ ]([ ]+\/\/(?:[^\n]+\/\/)?(?:=|:|\/|\/=)?)$/mg);

const RE_DBL_SLASH_IGNORE = new RegExp(`[ \\t]*${IGNORE}\\n(?=[^\\n]*//\\n)`, 'g');  // for post-process
const RE_DBL_RESTORE_SPACE = new RegExp(/(?<=\S)[ ]\/\/(\s+\/\/(?:[^\n]+\/\/)?(?:=|:|\/|\/=)?)$/mg);

/**
 * Preserve .method().chain() lines as-is, by adding inline comment lines.
 *
 *     cy.method()
 *         //__DOT__
 *         .foo().bar()
 *         //__DOT__
 *         .bat();
 *
 * Local "off" switch:
 *
 *     // no-preserve
 *     cy.method()
 *         .foo().bar()
 *         .bat();
 */
const RE_DOT_CHAIN_METHOD = new RegExp(/^(\s*\.[a-z_]\w*[\(\.])/mig);

const DOT = '//__DOT__';
const RE_DOT_LINE = new RegExp(`[ \\t]*${DOT}\\n`, 'g');  // for post-process

const NO_PRESERVE = '// no-preserve';
const RE_DOT_NO_PRESERVE = new RegExp(`(${NO_PRESERVE}\\n(?:[ \\t]*[^\\n]+\\n)+?)${DOT}\\n`, 'g');

/**
 * Prettier formats method chains as separate lines, e.g.
 *
 *     cy.method().m2()       cy.method()
 *       //__DOT__              .m2()
 *       .foo().bar()   --->    //__DOT__
 *       //__DOT__              .foo()
 *       .bat();                .bar()
 *                              //__DOT__
 *                              .bat();
 *
 * Restore .foo().bar() using this RegExp.
 *
 * Also handles muli-line:
 *
 *     cy.method()
 *       //__DOT__
 *       .foo().bar({
 *           ...
 *       }).more()
 *       //__DOT__
 *       .bat();
 */
const RE_CONCAT_DOTS = new RegExp(
  `(${DOT}\\n[ \\t]*\\.[^\\n]+(?:\\n[^\\n]+)*?(?:\\n[^\\n]*)?\\))\\n[ \\t]*(\\.[^\\n]+)`,
  'g'
);
// //__DOT__\n   .method()           ...\n              ')'\n             .more()
// (${DOT}\\n                                 (?:\\n[^\\n]*)?\\))\\n
//           [ \\t]*\\.[^\\n]+                                      [ \\t]*(\\.[^\\n]+)
//                            (?:\\n[^\\n]+)*?
//

const RE_CONCAT_DOTS_BEFORE = new RegExp(
  `(?<=^|\\n)([ \\t]*[^\\./ \\t][^\\n]+)\\n[ \\t]*(\\.[^\\n]+\\n)(?=(?:[ \\t]*\\.[^\\n]+\\n)*[ \\t]*${DOT})`,
  // 'g'
);
//                    cy                   \n       .method()\n            .m2()\n             //__DOT__
//           ([ \\t]*[^\\./ \\t][^\\n]+)          (\\.[^\\n]+\\n)
// (?<=^|\\n)                           \\n[ \\t]*               (?=                         [ \\t]*${DOT})
//                                                              (?:[ \\t]*\\.[^\\n]+\\n)*

/**
 * Parser pre-process source code.
 */
export function preprocess(code: string, options: PreserveLineOptions): string {
  //
  if (options.preserveFirstBlankLine) {
    code = code.replace(RE_OPEN_BLANK_LINE, '$1' + BR + '\n');
  }
  if (options.preserveLastBlankLine) {
    code = code.replace(RE_CLOSE_BLANK_LINE, BR + '\n' + '$1');
  }
  if (options.preserveEolMarker) {
    code = code.replace(RE_DOUBLE_SLASH_EOL, IGNORE + '\n' + '$1');
    code = code.replace(RE_DBL_SLASH_PRESERVE_SPACE, ' //$1');
  }
  if (options.preserveDotChain) {
    code = code.replace(RE_DOT_CHAIN_METHOD, DOT + '\n' + '$1');

    // Detect preceding '// no-preserve' and remove unwanted DOT's
    while (code.match(RE_DOT_NO_PRESERVE)) {
      code = code
        .replace(RE_DOT_NO_PRESERVE, '$1')  // slightly faster if there're many to replace
        .replace(RE_DOT_NO_PRESERVE, '$1');
    }
  }
  return code;
}

/**
 * Parser post-process source code.
 */
export function postprocess(code: string, options: PreserveLineOptions): string {
  //
  if (options.preserveFirstBlankLine || options.preserveLastBlankLine) {
    code = code.replace(RE_BR_LINE, '');
  }
  if (options.preserveDotChain) {

    // Concatenate .method()'s back onto the same line
    while (code.match(RE_CONCAT_DOTS)) {
      code = code
        .replace(RE_CONCAT_DOTS, '$1$2')  // slightly faster if there're many to replace
        .replace(RE_CONCAT_DOTS, '$1$2');
    }
    while (code.match(RE_CONCAT_DOTS_BEFORE)) {
      code = code
      .replace(RE_CONCAT_DOTS_BEFORE, '$1$2')
      .replace(RE_CONCAT_DOTS_BEFORE, '$1$2');
    }

    code = code.replace(RE_DOT_LINE, '');
  }
  if (options.preserveEolMarker) {
    code = code.replace(RE_DBL_SLASH_IGNORE, '');
    code = code.replace(RE_DBL_RESTORE_SPACE, ' $1');
    code = alignEqual(code);
    code = alignColon(code, options);
    code = alignTripleSlash(code);
  }
  return code;
}

//---------------------------------------------------------------------------------------------------- @ignore

/**
 * End-of-line '//=' will align equal sign for the consecutive lines:
 *
 *      a   = true; //=
 *      foo = "bar";
 */
const RE_DBL_SLASH_EQUAL = new RegExp(/\/\/=\n/);
const RE_ASSIGN_SEGMENTS = new RegExp(/(?<=(?:^|\n)[^=\n]*\n)(?=\s*\S.* [?&|*/+-]*=\s*\S)/);
const RE_ASSIGN_LINE = new RegExp(/^(\s*)(\S.*) ([?&|*/+-]*=\s*\S)/);

/**
 * Align the equal sign starting at lines with EOL '//=', for consecutive assignment lines.
 */
function alignEqual(code: string): string {

  if (!RE_DBL_SLASH_EQUAL.test(code) || !code) {
    return code;
  }

  // Break code into segments that starts with assignment lines
  const segs = code.split(RE_ASSIGN_SEGMENTS);

  // Align '=' in each segment and reconstruct code
  return ''.concat(...segs.map((seg) => _alignEqualBegin(seg)));
}

const RE_START_DBL_SLASH_EQUAL = new RegExp(/^[^\n]+\/\/=\n/);

// Align assignment lines at the start of a segment
function _alignEqualBegin(seg: string): string {

  // Skip if the segment doesn't start with an assignment line
  if (!RE_ASSIGN_LINE.test(seg) || !seg) {
    return seg;
  }

  const lines = seg.split(/(?<=\n)/);
  let doneLines: string[] = [];
  let assignLines: string[] = [];
  let reSameIndent = new RegExp(/^never/);

  // Align accumulated assignment lines in 'assignLines', if any
  const _alignAssignLines = () => {

    if (assignLines.length) {
      doneLines.push(..._alignEqualLines(assignLines));
      assignLines = [];
    }
  };

  // Group assignment lines by EOL '//='
  while (lines.length && RE_ASSIGN_LINE.test(lines[0])) {
    const line = <string>lines.shift();

    // Starting a new chunk of '//='
    if (RE_START_DBL_SLASH_EQUAL.test(line)) {

      _alignAssignLines();

      // @ts-ignore
      const indent = line.match(RE_ASSIGN_LINE)[1].length;
      reSameIndent = new RegExp(`^\\s{${indent}}\\S`);
      assignLines = [line];
    }

    // Continuing from accumulated chunk
    else if (assignLines.length && reSameIndent.test(line)) {
      assignLines.push(line);
    }

    // Don't align this assignment line
    else {
      _alignAssignLines();
      doneLines.push(line);
    }
  }
  _alignAssignLines();

  return ''.concat(...doneLines, ...lines);
}

// Align an array of assignment lines at '=' or equivalent, e.g. '+=' or '??='
function _alignEqualLines(lines: string[]): string[] {

  // @ts-ignore
  const maxLen = lines.map((line) => line.match(RE_ASSIGN_LINE)[2].length)
    .sort((a, b) => b - a)[0];

  return lines.map((line = '') => {
    // @ts-ignore
    const len = line.match(RE_ASSIGN_LINE)[2].length;
    return line.replace(RE_ASSIGN_LINE, '$1$2' + ' '.repeat(maxLen - len) + ' $3');
  });
}

//---------------------------------------------------------------------------------------------------- @ignore

const RE_TRI_SLASH_SEGS = new RegExp(/(?<=\n|^)(?=[^\n]*\/\/\/[=:]?\n)/);
const RE_DBL_SLASH_LINE = new RegExp(/^(?:(.*?)\s+|)\/\//);

/**
 * Triple slash '///' aligns consecutive '//' lines:
 *
 *     aaa = 1;         // one ///
 *     b = true;        // two
 *     cc = [1, 2, 3];  // three
 */
function alignTripleSlash(code: string): string {

  // Skip if no triple slash detected in code
  if (!RE_TRI_SLASH_SEGS.test(code)) {
    return code;
  }

  // Split into segments of triple slash as first line (except the first segment)
  const segs = code.split(RE_TRI_SLASH_SEGS);

  // Align each segment, then concatenate together for return
  return ''.concat(...segs.map((seg) => _alignDblSlashLines(seg)));
}

// Align '//' in consecutive lines
function _alignDblSlashLines(seg: string): string {

  // Skip if no triple slash detected in segment (first line)
  if (!RE_TRI_SLASH_SEGS.test(seg)) {
    return seg;
  }

  // Collect lines to align '//'
  const lines = seg.split(/(?<=\n)/);
  let alignLines = [];

  while (lines.length && lines[0].match(/\S/)) {
    alignLines.push(lines.shift());
  }

  // Maximum length of code prior to '//'
  // @ts-ignore
  const maxLen = alignLines.map((line = '') => {
    const match = line.match(RE_DBL_SLASH_LINE) || [];
    return match[1] ? match[1].length : 0;
  }).sort((a, b) => b - a)[0];

  // Align '//'
  alignLines = alignLines.map ((line = '') => {
    // @ts-ignore
    const match = line.match(RE_DBL_SLASH_LINE) || [];
    const len = match[1] ? match[1].length : 0;
    return line.replace(RE_DBL_SLASH_LINE, '$1' + ' '.repeat(maxLen - len) + '  //');
  });

  return ''.concat(...alignLines, ...lines);
}

//---------------------------------------------------------------------------------------------------- @ignore

/**
 * End-of-line '//:' will align equal sign for the consecutive lines:
 *
 *      private a    : boolean; //=
 *      readonly foo : string;
 *
 * Unlike alignObjectProperties, which only works with property key (typically single word), this marker
 * works for multiple words, e.g. private, protected, readonly, etc.
 */
const RE_DBL_SLASH_COLON = new RegExp(/\/\/:\n/);
const RE_DBL_SLASH_COLON_SEGMENTS = new RegExp(/(?<=\n)(?=[^\n]*\/\/:\n)/);
const RE_COLON_LINE = new RegExp(/^(\s*)([^:]+?)\s*:/);

/**
 * Align by ':' or value starting at lines with EOL '//:', for consecutive colon lines.
 */
function alignColon(code: string, options: any): string {

  if (!RE_DBL_SLASH_COLON.test(code) || !code || options.alignObjectProperties === 'none') {
    return code;
  }

  // Break code into segments that starts with the '//:' lines
  const segs = code.split(RE_DBL_SLASH_COLON_SEGMENTS);

  // Align ':' in each segment and reconstruct code
  return ''.concat(...segs.map((seg) => _alignColonBegin(seg, options)));
}

// Align assignment lines at the start of a segment
function _alignColonBegin(seg: string, options: any): string {

  // Skip if the segment doesn't start with '//:'
  if (!RE_DBL_SLASH_COLON.test(seg) || !seg) {
    return seg;
  }

  const getIndent = (line: string) => {
    const match = line.match(RE_COLON_LINE) || [];
    return match[1] ? match[1].length : 0;
  };

  // Collect lines to align ':'
  const lines = seg.split(/(?<=\n)/);
  let alignLines = [];
  const indent = getIndent(lines[0]);

  while (lines.length && RE_COLON_LINE.test(lines[0]) && getIndent(lines[0]) === indent) {
    alignLines.push(lines.shift());
  }

  // Maximum length of code prior to ':'
  // @ts-ignore
  const maxLen = alignLines.map((line = '') => {
    const match = line.match(RE_COLON_LINE) || [];
    return match[2] ? match[2].length : 0;
  }).sort((a, b) => b - a)[0];

  // Align ':'
  const alignColon = options.alignObjectProperties === 'colon';
  alignLines = alignLines.map ((line = '') => {
    // @ts-ignore
    const match = line.match(RE_COLON_LINE) || [];
    const len = match[2] ? match[2].length : 0;
    return line.replace(
      RE_COLON_LINE,
      alignColon
        ? ('$1$2' + ' '.repeat(maxLen - len) + ' :')
        : ('$1$2:' + ' '.repeat(maxLen - len))
    );
  });

  return ''.concat(...alignLines, ...lines);
}

//---------------------------------------------------------------------------------------------------- @ignore

/**
 * Helper function to collect plugins from default parser, given a language by name.
 *
 * @param options  Parser options.
 * @param languageName  Name of language.  If blank, then return an empty array.
 * @returns an array of parsers for the given language.
 */
export function filterByLanguage(options: ParserOptions, languageName?: string): Plugin[] {
  //
  if (!languageName) {
    return [];
  }

  const plugins = options.plugins.filter(
    (plugin) => typeof plugin !== 'string'
  ) as Plugin[];

  return plugins.filter(
    (plugin) => plugin.languages?.some((language) => language.name === languageName)
  );
}
