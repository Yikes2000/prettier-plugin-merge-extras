import { MergeSimpleImports } from './merge-imports/index';
import { PreserveLine } from './preserve-line';
import { AlignObjectProperties } from './align-obj-props';
import { MergeSimpleImports } from './merge-imports';
import { Playwright } from './playwright';

export const Extras = {

  options: {
    ...PreserveLine.options,
    ...AlignObjectProperties.options,
    ...MergeSimpleImports.options,
    ...Playwright.options
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
    return code;
  },
};
