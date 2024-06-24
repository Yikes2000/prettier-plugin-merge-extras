/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-use-before-define */

/**
 * End-of-line '//:' will align equal sign for the consecutive lines:
 *
 *      private a    : boolean; //=
 *      readonly foo : string;
 *
 * Unlike alignObjectProperties, which only works with property key (typically single word), this marker
 * works for multiple words, e.g. private, protected, readonly, etc.
 */
const RE_DBL_SLASH_COLON = /\/\/:\n/;
const RE_DBL_SLASH_COLON_SEGMENTS = /(?<=\n)(?=[^\n]*\/\/:\n)/;
const RE_COLON_LINE = /^(\s*)([^:]+?)\s*:/;

/**
 * Align by ':' or value starting at lines with EOL '//:', for consecutive colon lines.
 */
export function alignColon(code: string, options: any): string {
    if (!RE_DBL_SLASH_COLON.test(code) || !code || options.alignObjectProperties === "none") {
        return code;
    }

    // Break code into segments that starts with the '//:' lines
    const segs = code.split(RE_DBL_SLASH_COLON_SEGMENTS);

    // Align ':' in each segment and reconstruct code
    return "".concat(...segs.map((seg) => _alignColonBegin(seg, options)));
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
    const maxLen = alignLines
        .map((line = "") => {
            const match = line.match(RE_COLON_LINE) || [];
            return match[2] ? match[2].length : 0;
        })
        .sort((a, b) => b - a)[0];

    // Align ':'
    const isAlignColon = options.alignObjectProperties === "colon";
    alignLines = alignLines.map((line = "") => {
        // @ts-ignore
        const match = line.match(RE_COLON_LINE) || [];
        const len = match[2] ? match[2].length : 0;
        return line.replace(
            RE_COLON_LINE,
            isAlignColon ? `$1$2${" ".repeat(maxLen - len)} :` : `$1$2:${" ".repeat(maxLen - len)}`,
        );
    });

    return "".concat(...alignLines, ...lines);
}
