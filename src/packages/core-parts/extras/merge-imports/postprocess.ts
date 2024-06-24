/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * @trivago/prettier-plugin-sort-imports doesn't combine imports of the same target:
 *
 *     import { a } from "foo";
 *     import { b, c } from "foo";
 *     import { d } from "foo";
 *
 * These import lines are adjacent, and sorted by first import element.  Function mergeSimpleImports() combines them into
 * one line, then break into multi-line if necessary per printWidth option:
 *
 *     import { a, b, c, d } from "foo";
 *     import {
 *         Alpha,
 *         Bravo,
 *         Charlie,
 *         Delta
 *     } from "foo";
 */

interface MergeOptions {
    mergeSimpleImports?: boolean;
}

let mergeImports = true;

function setOptions(options: MergeOptions) {
    mergeImports = !!options.mergeSimpleImports;
}

export function postprocess(code: string, options: any): string {
    setOptions(options);

    // Skip if turned off, or empty code
    if (!mergeImports || code.match(/^\s*$/)) {
        return code;
    }

    return mergeSimpleImports(code, options);
}

// ---------------------------------------------------------------------------------------------------- @ignore

const RE_SPLIT_IMPORTS = /(?<=\nimport \{ [^}]+ \} from [^\n]+\n)/;

const RE_ADJ_IMPORTS = /(?<=\n)import \{ ([^}]+) \} from (\S+);\nimport \{ ([^}]+) \} from \2;\n/;

/**
 * Merge adjacent simple imports.
 */
function mergeSimpleImports(code: string, options: any): string {
    // Split code between imports and rest of the code
    const segs = code.split(RE_SPLIT_IMPORTS);
    const codeBody = segs[segs.length - 1].match(/^import\s+/m) ? "" : segs.pop();
    let importLines = "".concat(...segs);

    // Combine adjacent import lines as appropriate
    let changeCount = 0;
    while (importLines.match(RE_ADJ_IMPORTS)) {
        importLines = importLines.replace(RE_ADJ_IMPORTS, "import { $1, $3 } from $2;\n");
        // eslint-disable-next-line no-plusplus
        changeCount++;
    }
    if (changeCount === 0) {
        return code;
    }

    // Break into individual lines and reformat into multi-line as needed
    const newLines = importLines.split(/(?<=\n)/).map((line) => formatImport(line, options));

    return "".concat(...newLines) + codeBody;
}

// Detect import line with at least two import elements, e.g. "import { a, b } from ...;\n"
const RE_IMPORT_LINE = /^import \{ ((?:[^,]+, )+[^,]+) \} from ([^\n]+);\n$/;

/**
 * Sort import elements and break into multi-lie as needed
 */
function formatImport(origLine: string, options: any): string {
    let newLines;

    // Skip unless an import line with at least two elements
    if (!RE_IMPORT_LINE.test(origLine)) {
        return origLine;
    }

    const match = origLine.match(RE_IMPORT_LINE);
    const elements = match[1].split(/, /).sort(); // sorted elements
    const target = match[2];

    // Reconstruct import line, or multi-line if necessary
    if (origLine.length > options.printWidth) {
        const importElements = elements.map((x) => " ".repeat(options.tabWidth) + x).join(",\n");
        const trailingComma = options.trailingCommas === "none" ? "" : ",";
        newLines = `import {\n${importElements}${trailingComma}\n} from ${target};\n`;
    } else {
        newLines = `import { ${elements.join(", ")} } from ${target};\n`;
    }

    return newLines;
}
