import type { ParserOptions } from 'prettier';
import { preprocess as _preprocess, postprocess as _postprocess } from './parser';
import { options } from './options';

// Export 'preprocess' and 'postprocess' functions that check for handled languages
const handleParsers = ['babel', 'typescript'];

// function prepocess(parserName: string, code: string, options: ParserOptions): string {
//     return handleParsers.includes(parserName) ? _preprocess(code, options) : code;
// }

// function postpocess(parserName: string, code: string, options: ParserOptions): string {
//     return handleParsers.includes(parserName) ? _postprocess(code, options) : code;
// }

export const PreserveLine = {
    options,

    preprocess: (parserName: string, code: string, options: ParserOptions) =>
        handleParsers.includes(parserName) ? _preprocess(code, options) : code,

    postprocess: (parserName: string, code: string, options: ParserOptions) =>
        handleParsers.includes(parserName) ? _postprocess(code, options) : code
};
