/* eslint-disable no-param-reassign */
import { AlignObjectProperties } from "./align-obj-props";
import { MergeSimpleImports } from "./merge-imports";
import { Playwright } from "./playwright";
import { PreserveLine } from "./preserve-line";
import { ReturnParentheses } from "./return-parentheses";

export const Extras = {
    options: {
        ...PreserveLine.options,
        ...AlignObjectProperties.options,
        ...MergeSimpleImports.options,
        ...Playwright.options,
        ...ReturnParentheses.options,
    },

    preprocess: (code: string, options: any): string => {
        code = PreserveLine.preprocess(code, options);
        return code;
    },

    postprocess: (code: string, options: any): string => {
        code = PreserveLine.postprocess(code, options);
        code = MergeSimpleImports.postprocess(code, options);
        code = AlignObjectProperties.postprocess(code, options);
        code = Playwright.postprocess(code, options);
        code = ReturnParentheses.postprocess(code, options);
        return code;
    },
};
