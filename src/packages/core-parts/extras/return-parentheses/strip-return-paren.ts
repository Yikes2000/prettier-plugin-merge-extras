// RegExp for "<INDENT>return (\n" or "...=> (\n"
const RE_RETURN_OR_ARROW_FN_PAREN =
    // @ts-ignore
    /^(?<INDENT>[ \t]*)(?<RETURN_OR_ARROW_FN>return|[a-zA-Z_][^\n]+\s*=>)[ \t]*\([ \t]*\n[ \t]*/;

let semi = true;

/**
 * Strip outer parentheses from all multi-line return statements.
 * @param code Entire code file.
 * @return {string} code file without parentheses for multi-line returns.
 */
export function stripReturnParentheses(code: string, options?: any): string {
    let lines = code.split(/(?<=\n)/);
    const linesDone = [];
    let match;

    if (options) {
        semi = options?.semi ?? semi;
    }

    while (lines.length > 0) {
        // Find next "<INDENT>return (\n" or "...=> (" line
        // eslint-disable-next-line no-cond-assign
        while (lines.length > 0 && !(match = lines[0].match(RE_RETURN_OR_ARROW_FN_PAREN))) {
            linesDone.push(lines.shift());
        }

        // Done if not found
        if (lines.length === 0) {
            break;
        }

        // TODO: Handle one liner "...=> (...)"
        // const oneLinerRE = new RegExp(^(?<ARROW>[ \t]*[a-zA-Z_][^\n]+\s*=>\s*)\((?<EXPR>.+)\)(?<TAIL>[;]?\n)$);

        const indent = match?.groups?.INDENT;
        const indentMoreRE = new RegExp(`^(?:${indent}[ \\t]+\\S|${indent}[ \\t]+\\n)`);
        const endReturnRE = new RegExp(`^${indent}\\);?\n`);

        // Accumulate lines in "returnBlock" until matching "<INDENT>);\n" line
        const returnBlock = [lines.shift()];
        while (lines.length > 0 && (indentMoreRE.test(lines[0]) || endReturnRE.test(lines[0]))) {
            returnBlock.push(lines.shift());

            // Done?
            const endReturn = endReturnRE.test(returnBlock[returnBlock.length - 1]);
            if (endReturn) {
                break;
            }
        }

        // Found valid return block -- strip its outer parentheses
        if (endReturnRE.test(returnBlock[returnBlock.length - 1])) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            linesDone.push(stripReturnOuterParentheses(returnBlock));
        }

        // Otherwise failed to find end of return block "<INDENT>);\n",
        else {
            // Put back accumulated lines except the first "return (\n" line
            linesDone.push(returnBlock.shift());
            lines = [...returnBlock, ...lines];
        }
    }

    return linesDone.join("");
}

// RegExp for "<INDENT>..."
// @ts-ignore
const RE_INDENT = /^(?<INDENT>[ \t]*)/;

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

    // Decide whether to de-indent the block, by matching open/close symbols of first and last lines of inner block
    const innerFirstLastLine = returnBlock[1] + returnBlock[returnBlock.length - 2].replace(/^\s+/, "");
    const shouldDedent = innerFirstLastLine.match(/\(\n\)|\{\n\}|\[\n\]|>\n</) || returnBlock[2].match(/^\s*\./);

    // Combine first two lines, remove "(" from "return (" or "...=> (\n"
    const firstLine = returnBlock.splice(0, 2).join("").replace(RE_RETURN_OR_ARROW_FN_PAREN, "$1$2 ");

    returnBlock.splice(returnBlock.length - 1, 1); // remove last line ");"
    if (semi) {
        // Append ";" to the (new) last line as necessary
        returnBlock.push((returnBlock.pop() || "").replace(/(?<!;)\n$/, ";\n"));
    }

    // Dedent remaining lines if necessary
    if (shouldDedent) {
        // eslint-disable-next-line no-param-reassign
        returnBlock = returnBlock.map((line) => line.replace(new RegExp(`^${indent2}`), `${indent1}`));
    }

    return stripReturnParentheses([firstLine, ...returnBlock].join(""));
}
