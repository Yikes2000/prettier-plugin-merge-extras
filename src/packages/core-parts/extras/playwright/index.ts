import { options } from './options';
import { postprocess as _postprocess } from './postprocess';

const handleParsers = ['babel', 'typescript'];

// Export 'postprocess' function that check for handled languages
export const Playwright = {
  options,

  postprocess: (code: string, options: any) =>
    handleParsers.includes(options.parserName) ? _postprocess(code, options) : code,
};
