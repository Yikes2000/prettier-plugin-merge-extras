import type { AstPath, ParserOptions, Doc, Printer, Plugin } from 'prettier';
import { doc, format } from 'prettier';

const { softline } = doc.builders;

function printWithMergedPlugin(
  path: AstPath,
  options: ParserOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  print: (path: AstPath) => Doc,
): Doc {
  const node = path.getValue();

  const { originalText } = options;
  const plugins = options.plugins.filter((plugin) => typeof plugin !== 'string') as Plugin[];
  const sequentiallyFormattedText = plugins.slice(0, -1).reduce(
    (previousText, plugin) =>
      format(previousText, {
        ...options,
        plugins: [plugin],
      }).trimEnd(),
    originalText,
  );

  if (node?.comments) {
    node.comments.forEach((comment: any) => {
      // eslint-disable-next-line no-param-reassign
      comment.printed = true;
    });
  }

  return [sequentiallyFormattedText, softline];
}

export const printers: { [astFormat: string]: Printer } = {
  'merging-babel-ast': {
    print: printWithMergedPlugin,
  },
  'merging-typescript-ast': {
    print: printWithMergedPlugin,
  },
};
