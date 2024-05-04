import { PreserveLine } from './preserve-line';
// import { AlignProps } from './align-props';

export const Extras = {

  options: {
    ...PreserveLine.options,
    // ...AlignProps.options
  },

  preprocess: (code: string, options: any): string => {
    code = PreserveLine.preprocess(code, options);
    // code = AlignProps.preprocess(code, options);
    return code;
  },

  postprocess: (code: string, options: any): string => {
    code = PreserveLine.postprocess(code, options);
    // code = AlignProps.postprocess(code, options);
    return code;
  },
};
