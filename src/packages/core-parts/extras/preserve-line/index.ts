import { options } from "./options";
import { preprocess as _preprocess, postprocess as _postprocess } from "./parser";

const handleParsers = ["babel", "typescript"];

// Export 'preprocess' and 'postprocess' functions that check for handled languages
export const PreserveLine = {
    options,

    preprocess: (
        code: string,
        opts: any, //
    ) => (handleParsers.includes(opts.parserName) ? _preprocess(code, opts) : code),

    postprocess: (
        code: string,
        opts: any, //
    ) => (handleParsers.includes(opts.parserName) ? _postprocess(code, opts) : code),
};
