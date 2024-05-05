import { postprocess as _postprocess } from './postprocess';
import { options } from './options';

const handleParsers = ['babel', 'typescript'];

// Export 'postprocess' function that check for handled languages
export const MergeSimpleImports = {
    options,

    postprocess: (code: string, options: any) =>
        handleParsers.includes(options.parserName) ? _postprocess(code, options) : code
};
