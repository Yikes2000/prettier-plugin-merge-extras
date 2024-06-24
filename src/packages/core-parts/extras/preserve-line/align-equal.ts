/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-use-before-define */

/**
 * End-of-line '//=' will align equal sign for the consecutive lines:
 *
 *      a   = true; //=
 *      foo = "bar";
 */
const RE_DBL_SLASH_EQUAL = /\/\/=\n/;
const RE_ASSIGN_SEGMENTS = /(?<=(?:^|\n)[^=\n]*\n)(?=\s*\S.* [?&|*/+-]*=\s*\S)/;
const RE_ASSIGN_LINE = /^(\s*)(\S[^=]*) ([?&|*/+-]*=\s*\S)/;

/**
 * Align the equal sign starting at lines with EOL '//=', for consecutive assignment lines.
 */
export function alignEqual(code: string): string {

  if (!RE_DBL_SLASH_EQUAL.test(code) || !code) {
    return code;
  }

  // Break code into segments that starts with assignment lines
  const segs = code.split(RE_ASSIGN_SEGMENTS);

  // Align '=' in each segment and reconstruct code
  return ''.concat(...segs.map((seg) => _alignEqualBegin(seg)));
}

const RE_START_DBL_SLASH_EQUAL = /^[^\n]+\/\/=\n/;

// Align assignment lines at the start of a segment
function _alignEqualBegin(seg: string): string {

  // Skip if the segment doesn't start with an assignment line
  if (!RE_ASSIGN_LINE.test(seg) || !seg) {
    return seg;
  }

  const lines = seg.split(/(?<=\n)/);
  const doneLines: string[] = [];
  let assignLines: string[] = [];
  let reSameIndent = /^never/;

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
    return line.replace(RE_ASSIGN_LINE, `$1$2${' '.repeat(maxLen - len)} $3`);
  });
}
