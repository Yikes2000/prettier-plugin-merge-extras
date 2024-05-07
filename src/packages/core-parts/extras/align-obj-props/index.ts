import { postprocess as _postprocess } from './postprocess';
import { options } from './options';

const handleParsers = ['babel', 'typescript', 'angular'];

// Export 'postprocess' function that check for handled languages
export const AlignObjectProperties = {
    options,

    postprocess: (code: string, options: any) =>
        handleParsers.includes(options.parserName) ? _postprocess(code, options) : code
};
