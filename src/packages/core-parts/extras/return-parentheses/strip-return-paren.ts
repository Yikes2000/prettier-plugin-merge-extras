// RegExp for "<INDENT>return (\n" in file or line
const RE_RETURN_PARENTHESIS_LINE = /^(?<INDENT>[ \t]*)return[ \t]+\([ \t]*\n/;

/**
 * Strip outer parentheses from all multi-line return statements.
 * @param code Entire code file.
 * @return {string} code file without parentheses for multi-line returns.
 */
export function stripReturnParentheses(code: string): string {
    let lines = code.split(/(?<=\n)/);
    const linesDone = [];
    let match;

    while (lines.length > 0) {
        // Find next "<INDENT>return (\n" line
        // eslint-disable-next-line no-cond-assign
        while (lines.length > 0 && !(match = lines[0].match(RE_RETURN_PARENTHESIS_LINE))) {
            linesDone.push(lines.shift());
        }

        // Done if not found
        if (lines.length === 0) {
            break;
        }

        const indent = match?.groups?.INDENT;
        const indentMoreRE = new RegExp(`^(?:${indent}[ \\t]+\\S|[ \\t]*\\n)`);
        const endReturnRE = new RegExp(`^${indent}\\);\n`);

        // Accumulate lines in "returnBlock" until matching "<INDENT>);\n" line
        const returnBlock = [lines.shift()];
        while (lines.length > 0 && (indentMoreRE.test(lines[0]) || endReturnRE.test(lines[0]))) {
            returnBlock.push(lines.shift());
        }

        // Failed to find end of return block "<INDENT>);\n", put back accumulated lines except the first "return (\n" line
        if (!endReturnRE.test(returnBlock[returnBlock.length - 1])) {
            linesDone.push(returnBlock.shift());
            lines = [...returnBlock, ...lines];
        }

        // Found valid return block -- strip its outer parentheses
        else {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            linesDone.push(stripReturnOuterParentheses(returnBlock));
        }
    }

    return linesDone.join("");
}

// RegExp for "<INDENT>..."
const RE_INDENT = /^(?<INDENT>[ \t]*)/;

// Detect closing parenthesis or brackets
const RE_CLOSING_SYMBOL = /^\s*[})\]<]/;

/**
 * Given a multi-line return statement, strip the outer parentheses.
 *
 * @example
 * // Input
 *     return (
 *         sum(
 *             sum(1, 2, 3),
 *             sum(1, 2, 3)
 *         ) + 2
 *     );
 * .
 * // Output
 *     return sum()
 *         sum(1, 2, 3),
 *         sum(1, 2, 3)
 *     ) + 2;
 *
 * @param returnBlock  Return statement lines.
 * @return {string[]} return statement without the outer parentheses.
 */
function stripReturnOuterParentheses(returnBlock: string[]): string {
    if (returnBlock.length <= 2) {
        return returnBlock.join("");
    }

    const match1 = returnBlock[0].match(RE_INDENT);
    const indent1 = match1?.groups?.INDENT;

    const match2 = returnBlock[1].match(RE_INDENT);
    const indent2 = match2?.groups?.INDENT;

    // Combine first two lines, remove "(" from "return ("
    const firstLine = returnBlock
        .splice(0, 2)
        .join("")
        .replace(/^(\s*return)\s*\(\s*\n\s*/, "$1 ");

    returnBlock.splice(returnBlock.length - 1, 1); // remove last line ");"
    returnBlock.push((returnBlock.pop() || "").replace(/\n$/, ";\n")); // append ";" to the (new) last line

    // Dedent remaining lines if the last line start with a closing parenthesis or bracket
    const otherLines = !RE_CLOSING_SYMBOL.test(returnBlock[returnBlock.length - 1])
        ? returnBlock
        : returnBlock.map((line) => line.replace(new RegExp(`^${indent2}`), `${indent1}`));

    return stripReturnParentheses([firstLine, ...otherLines].join(""));
}
