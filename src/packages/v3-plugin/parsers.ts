import type { SubstitutePatch } from 'core-parts';
import { makePatches, applyPatches, Extras } from 'core-parts';
import type { Parser, ParserOptions, Plugin } from 'prettier';
import { format } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';
import { parsers as htmlParsers } from 'prettier/plugins/html';
import { parsers as typescriptParsers } from 'prettier/plugins/typescript';

async function sequentialFormattingAndTryMerging(
  options: ParserOptions,
  plugins: Plugin[],
  languageImplementedPlugin?: Plugin,
): Promise<string> {
  const customLanguageSupportedPlugins = languageImplementedPlugin
    ? [languageImplementedPlugin]
    : [];

  const { originalText } = options;
  const sequentialFormattingOptions = {
    ...options,
    rangeEnd: Infinity,
    plugins: customLanguageSupportedPlugins,
  };

  const firstFormattedTextPromise = format(originalText, sequentialFormattingOptions);

  /**
   * Changes that may be removed during the sequential formatting process.
   */
  const patches: SubstitutePatch[] = [];

  const sequentiallyMergedText = await plugins.reduce<Promise<string>>(
    async (formattedPrevTextPromise, plugin) => {
      const formattedPrevText = await formattedPrevTextPromise;
      const temporaryFormattedText = await format(formattedPrevText, {
        ...sequentialFormattingOptions,
        plugins: [...customLanguageSupportedPlugins, plugin],
      });

      const temporaryFormattedTextWithoutPlugin = await format(
        temporaryFormattedText,
        sequentialFormattingOptions,
      );

      patches.push(...makePatches(temporaryFormattedTextWithoutPlugin, temporaryFormattedText));

      if (patches.length === 0) {
        return temporaryFormattedText;
      }

      return applyPatches(temporaryFormattedTextWithoutPlugin, patches);
    },
    firstFormattedTextPromise,
  );

  return sequentiallyMergedText;
}

function transformParser(
  parserName: SupportedParserNames,
  defaultParser: Parser,
  languageName?: string,
): Parser {
  return {
    ...defaultParser,
    parse: async (text: string, options: ParserOptions): Promise<FormattedTextAST> => {
      const plugins = options.plugins.filter((plugin) => typeof plugin !== 'string') as Plugin[];
      const pluginIndex = plugins.findIndex(
        (plugin) =>
          Object.values(plugin.parsers ?? {}).every(
            (parser) => parser.astFormat === 'merging-ast',
          ) &&
          Object.entries(plugin.printers ?? {}).every(
            ([astFormat, printer]) =>
              astFormat === 'merging-ast' && Object.keys(printer).every((key) => key === 'print'),
          ),
      );

      if (pluginIndex === -1) {
        throw new Error(
          "The structure of this plugin may have changed. If it's not in development, you may need to report an issue.",
        );
      }

      let languageImplementedPlugin: Plugin | undefined;
      if (languageName) {
        languageImplementedPlugin = plugins
          .slice(0, pluginIndex)
          .filter((plugin) => plugin.languages?.some((language) => language.name === languageName))
          .at(0);

        if (!languageImplementedPlugin) {
          throw new Error(
            `There doesn't seem to be any plugin that supports ${languageName} formatting.`,
          );
        }
      }

      const optionsExtras = { ...options, parserName };
      let code: string = Extras.preprocess(text, optionsExtras);

      const parserImplementedPlugins = plugins
        .slice(0, pluginIndex)
        .filter((plugin) => plugin.parsers?.[parserName]);
      code = await sequentialFormattingAndTryMerging(
        {
          ...options,
          originalText: code,
        },
        parserImplementedPlugins,
        languageImplementedPlugin,
      );

      code = Extras.postprocess(code, optionsExtras);

      return {
        type: 'FormattedText',
        body: code,
      };
    },
    astFormat: 'merging-ast',
  };
}

export const parsers: { [parserName: string]: Parser } = {
  babel: transformParser('babel', babelParsers.babel),
  typescript: transformParser('typescript', typescriptParsers.typescript),
  angular: transformParser('angular', htmlParsers.angular),
  html: transformParser('html', htmlParsers.html),
  vue: transformParser('vue', htmlParsers.vue),
  astro: transformParser('astro', {} as Parser, 'astro'),
  svelte: transformParser('svelte', {} as Parser, 'svelte'),
};
