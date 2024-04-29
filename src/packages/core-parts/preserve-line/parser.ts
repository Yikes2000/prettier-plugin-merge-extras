import type { ParserOptions, Plugin } from 'prettier';

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
const BR = '//__BR__';
const OPEN_BLANK_LINE = new RegExp(/([\{\[\(]\s*\n)(?:\s*\n)+/g);

const BR_LINE = new RegExp(`^\\s*${BR}$`, 'mg');  // for post-process

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
const DOUBLE_SLASH_EOL = new RegExp(/^(.*\/\/)$/mg);

const DBL_SLASH_IGNORE = new RegExp(`[ \\t]*${IGNORE}\\n(?=[^\\n]*//\\n)`, 'g');  // for post-process

/**
 * Parser pre-process source code.
 */
export function preprocess(code: string, options: ParserOptions): string {
  //
  if (options.preserveFirstBlankLine) {
    code = code.replace(OPEN_BLANK_LINE, '$1' + BR + '\n');
  }
  if (options.preserveEolMarker) {
    code = code.replace(DOUBLE_SLASH_EOL, IGNORE + '\n' + '$1');
  }
  return code;
}

/**
 * Parser post-process source code.
 */
export function postprocess(code: string, options: ParserOptions): string {
  //
  if (options.preserveFirstBlankLine) {
    code = code.replace(BR_LINE, '');
  }
  if (options.preserveEolMarker) {
    code = code.replace(DBL_SLASH_IGNORE, '');
  }
  return code;
}

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
