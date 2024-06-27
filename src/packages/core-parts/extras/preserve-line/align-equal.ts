/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */

/**
 * End-of-line '//=' will align equal sign for the consecutive lines:
 *
 *      a   = true; //=
 *      foo = "bar";
 */
const RE_DBL_SLASH_EQUAL = /\/\/=\n/;
const RE_ASSIGN_SEGMENTS = /(?<=(?:^|\n))(?=[^\n]+\/\/=[ \t]*\n)/;
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
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return "".concat(...segs.map((seg) => _alignEqualBegin(seg)));
}

// ---------------------------------------------------------------------------------------------------- @ignore

// Align an array of assignment lines at '=' or equivalent, e.g. '+=' or '??='
function _alignEqualLines(lines: string[]): string[] {

  const maxLen = lines.map((line) => line.match(RE_ASSIGN_LINE)[2].length)
    .sort((a, b) => b - a)[0];

  return lines.map((line = '') => {
    const len = line.match(RE_ASSIGN_LINE)[2].length;
    return line.replace(RE_ASSIGN_LINE, `$1$2${' '.repeat(maxLen - len)} $3`);
  });
}

// Align assignment lines at the start of a segment
function _alignEqualBegin(seg: string): string {
  const lines = seg.split(/(?<=\n)/);

  // Skip if the segment doesn't start with an assignment line
  if (!seg || !RE_ASSIGN_LINE.test(lines[0])) {
    return seg;
  }

  const doneLines: string[] = [];
  const assignLines: string[] = [lines.shift()];

  const indent = assignLines[0].match(RE_ASSIGN_LINE)[1].length;
  const reSameIndent = new RegExp(`^\\s{${indent}}\\S`);

  // Accumulate assignment lines
  while (lines.length && RE_ASSIGN_LINE.test(lines[0]) && reSameIndent.test(lines[0])) {
      assignLines.push(<string>lines.shift());
  }

  if (assignLines.length > 0) {
    doneLines.push(..._alignEqualLines(assignLines));
  }

  return "".concat(...doneLines, ...lines);
}
