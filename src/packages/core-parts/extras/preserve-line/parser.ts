/* eslint-disable no-param-reassign */
import type { ParserOptions, Plugin } from "prettier";

import { alignColon } from "./align-colon";
import { alignEqual } from "./align-equal";
import { alignTripleSlash } from "./align-slash";

interface PreserveLineOptions {
    preserveFirstBlankLine?: boolean;
    preserveLastBlankLine?: boolean;
    preserveEolMarker?: boolean;
    preserveDotChain?: boolean;
}

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
const RE_OPEN_BLANK_LINE = /([{[(=:|&]\s*\n)(?:\s*\n)+/g;

const BR = "//__BR__";
const RE_BR_LINE = new RegExp(`[ ]*${BR}$`, "mg"); // for post-process

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
const RE_CLOSE_BLANK_LINE = /(?<=\n)(?:\s*\n)+(\s*[}\])])/g;

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
const IGNORE = "// prettier-ignore";
const RE_DOUBLE_SLASH_EOL = /^(.*\/\/)$/gm;
const RE_DBL_SLASH_PRESERVE_SPACE = /(?<=\S)[ ]([ ]+\/\/(?:[^\n]+\/\/)?(?:=|:|\/|\/=)?)$/gm;

const RE_DBL_SLASH_IGNORE = new RegExp(`[ \\t]*${IGNORE}\\n(?=[^\\n]*//\\n)`, "g"); // for post-process
const RE_DBL_RESTORE_SPACE = /(?<=\S)[ ]\/\/(\s+\/\/(?:[^\n]+\/\/)?(?:=|:|\/|\/=)?)$/gm;

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
const RE_DOT_CHAIN_METHOD = /^(\s*\.[a-z_]\w*[(.])/gim;

const DOT = "//__DOT__";
const RE_DOT_LINE = new RegExp(`[ \\t]*${DOT}\\n`, "g"); // for post-process

const NO_PRESERVE = "// no-preserve";
const RE_DOT_NO_PRESERVE = new RegExp(`(${NO_PRESERVE}\\n(?:[ \\t]*[^\\n]+\\n)+?)${DOT}\\n`, "g");

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
    "g",
);
// //__DOT__\n   .method()           ...\n              ')'\n             .more()
// (${DOT}\\n                                 (?:\\n[^\\n]*)?\\))\\n
//           [ \\t]*\\.[^\\n]+                                      [ \\t]*(\\.[^\\n]+)
//                            (?:\\n[^\\n]+)*?
//

const RE_CONCAT_DOTS_BEFORE = new RegExp(
    `(?<=^|\\n)([ \\t]*[^\\./ \\t][^\\n]+)\\n[ \\t]*(\\.[^\\n]+\\n)(?=(?:[ \\t]*\\.[^\\n]+\\n)*[ \\t]*${DOT})`,
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
        code = code.replace(RE_OPEN_BLANK_LINE, `$1${BR}\n`);
    }
    if (options.preserveLastBlankLine) {
        code = code.replace(RE_CLOSE_BLANK_LINE, `${BR}\n$1`);
    }
    if (options.preserveEolMarker) {
        code = code.replace(RE_DOUBLE_SLASH_EOL, `${IGNORE}\n$1`);
        code = code.replace(RE_DBL_SLASH_PRESERVE_SPACE, " //$1");
    }
    if (options.preserveDotChain) {
        code = code.replace(RE_DOT_CHAIN_METHOD, `${DOT}\n$1`);

        // Detect preceding '// no-preserve' and remove unwanted DOT's
        while (code.match(RE_DOT_NO_PRESERVE)) {
            code = code
                .replace(RE_DOT_NO_PRESERVE, "$1") // slightly faster if there're many to replace
                .replace(RE_DOT_NO_PRESERVE, "$1");
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
        code = code.replace(RE_BR_LINE, "");
    }
    if (options.preserveDotChain) {
        // Concatenate .method()'s back onto the same line
        while (code.match(RE_CONCAT_DOTS)) {
            code = code
                .replace(RE_CONCAT_DOTS, "$1$2") // slightly faster if there're many to replace
                .replace(RE_CONCAT_DOTS, "$1$2");
        }
        while (code.match(RE_CONCAT_DOTS_BEFORE)) {
            code = code.replace(RE_CONCAT_DOTS_BEFORE, "$1$2").replace(RE_CONCAT_DOTS_BEFORE, "$1$2");
        }

        code = code.replace(RE_DOT_LINE, "");
    }
    if (options.preserveEolMarker) {
        code = code.replace(RE_DBL_SLASH_IGNORE, "");
        code = code.replace(RE_DBL_RESTORE_SPACE, " $1");
        code = alignEqual(code);
        code = alignColon(code, options);
        code = alignTripleSlash(code);
    }
    return code;
}

// ---------------------------------------------------------------------------------------------------- @ignore

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

    const plugins = options.plugins.filter((plugin) => typeof plugin !== "string") as Plugin[];

    return plugins.filter((plugin) => plugin.languages?.some((language) => language.name === languageName));
}
