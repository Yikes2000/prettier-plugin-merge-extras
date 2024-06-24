/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-use-before-define */

const RE_TRI_SLASH_SEGS = /(?<=\n|^)(?=[^\n]*\/\/\/[=:]?\n)/;
const RE_DBL_SLASH_LINE = /^(?:(.*?)\s+|)\/\//;

/**
 * Triple slash '///' aligns consecutive '//' lines:
 *
 *     aaa = 1;         // one ///
 *     b = true;        // two
 *     cc = [1, 2, 3];  // three
 */
export function alignTripleSlash(code: string): string {
    // Skip if no triple slash detected in code
    if (!RE_TRI_SLASH_SEGS.test(code)) {
        return code;
    }

    // Split into segments of triple slash as first line (except the first segment)
    const segs = code.split(RE_TRI_SLASH_SEGS);

    // Align each segment, then concatenate together for return
    return "".concat(...segs.map((seg) => _alignDblSlashLines(seg)));
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
    const maxLen = alignLines
        .map((line = "") => {
            const match = line.match(RE_DBL_SLASH_LINE) || [];
            return match[1] ? match[1].length : 0;
        })
        .sort((a, b) => b - a)[0];

    // Align '//'
    alignLines = alignLines.map((line = "") => {
        // @ts-ignore
        const match = line.match(RE_DBL_SLASH_LINE) || [];
        const len = match[1] ? match[1].length : 0;
        return line.replace(RE_DBL_SLASH_LINE, `$1${" ".repeat(maxLen - len)}  //`);
    });

    return "".concat(...alignLines, ...lines);
}
