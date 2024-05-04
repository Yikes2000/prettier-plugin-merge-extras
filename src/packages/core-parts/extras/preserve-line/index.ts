import { preprocess as _preprocess, postprocess as _postprocess } from './parser';
import { options } from './options';

const handleParsers = ['babel', 'typescript'];

// Export 'preprocess' and 'postprocess' functions that check for handled languages
export const PreserveLine = {
    options,

    preprocess: (code: string, options: any) =>
        handleParsers.includes(options.parserName) ? _preprocess(code, options) : code,

    postprocess: (code: string, options: any) =>
        handleParsers.includes(options.parserName) ? _postprocess(code, options) : code
};
