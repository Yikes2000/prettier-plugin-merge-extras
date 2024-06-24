import { options } from "./options";
import { postprocess as _postprocess } from "./postprocess";

const handleParsers = ["babel", "typescript", "angular"];

// Export 'postprocess' function that check for handled languages
export const ReturnParentheses = {
    options,

    postprocess: (code: string, opts: any) =>
        handleParsers.includes(opts.parserName) ? _postprocess(code, opts) : code,
};
