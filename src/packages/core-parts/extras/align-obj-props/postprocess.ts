
interface AlignOptions {
  alignObjectProperties?: string;
  alignSingleProperty?: boolean;
};

const validOptions = ['colon', 'value', 'none'];
let alignObjPropBy = 'colon';
let alignSingleProperty = false;

function setOptions(options: AlignOptions) {

    alignObjPropBy = options.alignObjectProperties ?? alignObjPropBy;

    if (!validOptions.includes(alignObjPropBy)) {
        alignObjPropBy = validOptions[0];
    }

    alignSingleProperty = !!options.alignSingleProperty;
}

export function postprocess(code: string, options: any): string {

    setOptions(options);
    if (alignObjPropBy === 'none') {
        return code;
    }

    return alignObjectProperties(code, options);
}

//---------------------------------------------------------------------------------------------------- @ignore

/**
 * Align object properties.
 */
function alignObjectProperties(code: string, options: any): string {

    // Split code according to open and close curly braces, '{' and '}'
    const segs = splitByCurly(code);
    const group = {};

    let ignoreAboveLvl = -1;

    // Walk through segments by indentation grouping, align object properties in each
    for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        const indent = seg.firstLine.indent;

        // Align object properties for groups with higher indentations
        Object.keys(group)
            .map((indentLvl) => Number(indentLvl))
            .filter((indentLvl) => indentLvl > indent)
            .forEach((indentLvl) => {

                if (ignoreAboveLvl < 0 || indentLvl <= ignoreAboveLvl) {
                    alignObjectPropLevel(segs, group[indentLvl], indentLvl);
                }
                delete group[indentLvl];
            });

        // Collect segments by indentation level
        group[indent] ||= [];
        group[indent].push(i);

        // Handle EOL '//' as alias for applying '// prettier-ignore' to the line
        if (ignoreAboveLvl >= 0) {
            if (indent <= ignoreAboveLvl) {
                ignoreAboveLvl = -1;
            }
        }
        else if (seg.beginIgnore) {
            ignoreAboveLvl = indent;
        }
    }

    return ''.concat(...segs.map((x) => x.lines));
}

//---------------------------------------------------------------------------------------------------- @ignore

/**
 * RegExp to split code by open/close curly brace into segments of lines:
 *   - '{' at the end of segment
 *   - '}' at the start of segment
 *
 * Split after open curly at the end-of-line:
 *
 *     > ... {                (?:[ \t]*\/\/(?:[^\n]*\/\/)?)?     for optional '//' or '// ... //'
 *             <=== RE: (?<=\{                              \n)
 *     >
 *
 * Split prior to close curly at the beginning-of-line:
 *
 *     >
 *           <=== RE: (?<=\n)(?=[ \t]*\})
 *     >    }
 */
const RE_CURLY_BRACE_SEGMENTATION = new RegExp(/(?<=\{(?:[ \t]*\/\/(?:[^\n]*\/\/)?)?\n)|(?<=\n)(?=[ \t]*\})/s);

// Test if a segment starts with close brace '}'
const RE_START_IS_OPEN_CURLY = new RegExp(/^[ \t]*\}/);

// Test if a segment ends with open brace '{', plus optional '//' or '// ... //'
const RE_END_IS_OPEN_CURLY = new RegExp(/\{(?:[ \t]*\/\/(?:[^\n]*\/\/)?)?\n[ \t\n]*$/);

// Detect if a segment ends with open curly but EOL '//', indicating prettier-ignore
const RE_END_IS_PRETTIER_IGNORE = new RegExp(/\{(?:[ \t]*\/\/(?:[^\n]*\/\/)?)\n[ \t\n]*$/);

// Detect open brace from function declaration, e.g. ') {' or '=> {', and exceptions
const RE_END_IS_FUNC_OPEN_BRACE = new RegExp(/[\w\)]\s*\{[ \t\n]*$/);
const RE_END_IS_OBJ_OPEN_BRACE = new RegExp(/\b(?:return|throw)\s*\{[^\n]*[ \t\n]*$/i);

// Indentation count (of spaces)
function getIndent(line: string) {
    return line.match(/^[ \t\n]*$/) ? 9999 : line.match(/^([ \t]*)/)[0].length;
}

// Create a rudimentary segment, with data about first and last non-blank lines
function makeSegment(lines: string) {

    // All blank lines
    if (lines.match(/^[ \t\n]*$/)) {

        return {
            lines,
            firstLine: { indent: 9999 },
            listLine: { text: lines, indent: 9999 },
        };
    }

    // First and last non-blank lines
    const firstLine = lines.match(/^(?:[ \t]*\n)*([ \t]*\S.*\n)/)[1];
    const lastLine = lines.match(/([ \t]*\S.*\n)(?:[ \t\n]*)$/)[1];

    const linesNoComment = lines.replace(/\s*\/\/[^\n]*(?=\n)/g, '');

    // prettier-ignore
    return {
        lines,

        firstLine : { text: firstLine, indent: getIndent(firstLine) },
        lastLine  : { text: lastLine,  indent: getIndent(lastLine) },

        startIsCloseCurly  : RE_START_IS_OPEN_CURLY.test(firstLine),
        endIsOpenCurly     : RE_END_IS_OPEN_CURLY.test(lastLine),
        endIsIgnore        : RE_END_IS_PRETTIER_IGNORE.test(lastLine),

        endIsFuncOpenCurly : RE_END_IS_FUNC_OPEN_BRACE.test(linesNoComment)
            && !RE_END_IS_OBJ_OPEN_BRACE.test(linesNoComment),
    };
}

/**
 * Split code into segments by curly braces - open '{' at the end of a segment, or close '}' at the beginning of a segment.
 * Combine segments when incorrect indentation occurs across curly braces.
 *
 * e.g.
 *       foo().bar({
 *     statement1;    // <--- invalid indentation
 *       });
 *
 * Full example:
 *
 *     //                --+
 *     // Note...          |
 *     //                  | Lvl-0 segment
 *     const a = 2;        |
 *     const b = true;     |
 *     const c = {       --+
 *                       -----+
 *         flag: true,        | Lvl-4
 *         msg: 'abc',        |
 *         data: {       -----+
 *             a: 1,     --------+
 *             b: 2,             |
 *             foo: `aaa         |
 *     bbb                       | Lvl-8
 *     ccc                       |
 *     `,                        |
 *             bar: 2,   --------+
 *         },            -----+
 *                            | Lvl-4
 *         xyz: false,   -----+
 *     };                --+
 *                         |
 *     statement1;         | Lvl-0
 *     statement2;         |
 *     statement3;       --+
 *
 */
function splitByCurly(code: string): any[] {

    // Split code into rudimentary line segments by curly braces
    const rawSegs = code.split(RE_CURLY_BRACE_SEGMENTATION)
        .map((lines) => makeSegment(lines));

    // Combine segments when indentation is wrong
    const seg = [ rawSegs.shift() ];
    while (rawSegs.length) {

        const prev = seg[seg.length - 1];
        const next = rawSegs.shift();

        // Open '{' followed by close '}' curly line must have same indent
        const openCloseBadIndent =

            prev.endIsOpenCurly && next.startIsCloseCurly
            && prev.lastLine.indent !== next.firstLine.indent;

        // Open curly must lead to greater indent in the next segment
        const openNotIncreaseIndent =

            prev.endIsOpenCurly && !next.startIsCloseCurly
            && prev.lastLine.indent >= next.firstLine.indent;

        // Close curly must reduce indent from previous segment
        const closeNotReduceIndent =

            !prev.endIsOpenCurly && next.startIsCloseCurly
            && prev.lastLine.indent <= next.firstLine.indent;

        // Previous segment first line indentation must be less or equal to the last line's indent
        const prevSegInvalidIndent =

            prev.firstLine.indent > prev.lastLine.indent
            && !prev.lastLine.text.match(/^\s*[\)\}\]\>]/);

        const mergeToPrev = openCloseBadIndent || openNotIncreaseIndent || closeNotReduceIndent
            || prevSegInvalidIndent;

        if (mergeToPrev) {
            seg[seg.length - 1] = makeSegment(prev.lines + next.lines);
        }
        else {
            seg.push(next);
        }
    }

    return seg;
}

//---------------------------------------------------------------------------------------------------- @ignore

/**
 * Align object properties for segments in the same scope (indentation level).
 *
 *     const a = {
 *         x: 10,            // <-- group 1
 *         y: 20,            // <--
 *         foo: [            // <--
 *             1, 2, 3, 4,
 *         ],
 *         a: true,          // <-- group 2
 *         b: false,         // <--
 *     };
 *
 * '// <--' lines are in the same scope, albeit two groups.  Consecutive lines form a group.
 */
function alignObjectPropLevel(segs: any[], idx: number[], indent: number) {

    // Skip if function or class declaration
    if (idx[0] > 0) {
        const prevSeg = segs[idx[0] - 1];
        if (prevSeg.endIsFuncOpenCurly) {
            return;
        }
    }

    // Group property key 'key:', '[key]:', '"key":', or "'key':"
    const RE_PROPERTY = getRegExpProperty(indent);

    // Group continuation with inline comment, spread, and property name shorthand
    const RE_COMMENT = new RegExp(`^[ ]{${indent}}//`);
    const RE_SPREAD_OR_PROP_SHORTHAND = new RegExp(`^[ ]{${indent}}(?:\\.\\.\\.)?\\w+,`);

    const isGroupContinuation = (line) => RE_PROPERTY.test(line) || RE_COMMENT.test(line)
            || RE_SPREAD_OR_PROP_SHORTHAND.test(line);

    let change = { count: 0 };

    // Re-format object properties for groups of consecutive lines
    const mySegs = idx.map((i) => segs[i]);
    mySegs.forEach((seg) => {
        const lines = seg.lines.split(/(?<=\n)/);

        // Divide lines into chunks, initialize first chunk with first line
        const firstLine = lines.shift();
        let lastChunk = [firstLine];
        let chunks: any[] = [lastChunk];
        let isPrevChunkContinuing = isGroupContinuation(firstLine);

        // Each chunk is consecutive lines of property key, comment, spread, or property shorthand, followed by other lines
        while (lines.length) {
            const line = lines.shift();
            const isLineContinuingGroup = isGroupContinuation(line);

            // Start a new chunk when last chunk ends with 'other' line and the current line is a group-continuation line
            if (!isPrevChunkContinuing && isLineContinuingGroup) {
                chunks.push(lastChunk = []);
            }

            lastChunk.push(line);
            isPrevChunkContinuing = isLineContinuingGroup;
        }

        // Align each chunk, then reconstitute into strings
        chunks = chunks
            .map((chunk) => alignObjectPropGroup(chunk, indent, change))
            .map((chunk) => ''.concat(...chunk));

        seg.chunks = chunks;
    });

    // Exception: skip for single or no property
    if (change.count > 0 && (change.count > 1 || alignSingleProperty)) {
        mySegs.forEach((seg) => seg.lines = ''.concat(...seg.chunks));
    }
}

/**
 * RegExp for property key 'key:', '[key]:', '"key":', or "'key':".
 */
function getRegExpProperty(indent: number) {
    return new RegExp(`^[ ]{${indent}}(\\w+|\\[[\\w\\.]+\\]|(['"])[^\\1\\n]+\\1):`);
}

/**
 * Align object properties in a given group of lines.
 */
function alignObjectPropGroup(group: string[], indent: number, change: any): string[] {

    const RE_PROPERTY = getRegExpProperty(indent);

    // Keep a countdown of ticks if there are even number of them, so we ignore text when count is odd
    let ticks = countBackTicks(''.concat(...group));
    ticks = ( ticks % 2 ) ? 0 : ticks;

    // What's the length of the longest property key?
    const maxLen = group.filter((line) => RE_PROPERTY.test(line)) // property lines only
        .map((line) => line.match(RE_PROPERTY)[1].length) // get property keys, their length
        .sort((a, b) => b - a)[0]; // get the maximum length

    group = group.map((line) => {

        const key = (line.match(RE_PROPERTY) || {})[1];
        const inBetweenTicks = ticks > 0 && ticks % 2;

        if (key && !inBetweenTicks) {
            const padLen = maxLen - key.length;

            line = line.replace(
                RE_PROPERTY,
                (alignObjPropBy === 'colon')
                    ? (' '.repeat(indent) + key + ' '.repeat(padLen + 1) + ':')
                    : (' '.repeat(indent) + key + ':' + ' '.repeat(padLen)),
            );
            change.count++;
        }

        if (ticks > 0) {
            ticks -= countBackTicks(line);
        }

        return line;
    });

    return group;
}

/**
 * Count back-ticks in a string.  The count being even indicates presence of back-tick quotes, e.g.
 *
 *     const a = {
 *         first: true,
 *         then: `
 *       foo: 1,
 *       be: 2,
 *     `,
 *         last: false,
 *     };
 *
 * We ignore the text between back-ticks.
 */
function countBackTicks(code: string): number {
    return code.split('').filter((c) => c ==="`").length;
}
