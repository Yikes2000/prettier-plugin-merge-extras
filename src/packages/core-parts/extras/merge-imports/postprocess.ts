import { format } from 'prettier';

interface MergeOptions {
  mergeSimpleImports?: boolean;
};

let mergeImports = true;

function setOptions(options: MergeOptions) {
    mergeImports = !!options.mergeSimpleImports;
}

export function postprocess(code: string, options: any): string {

    setOptions(options);
    if (!mergeImports || code.match(/^\s*$/)) {
        return code;
    }

    return mergeSimpleImports(code, options);
}

//---------------------------------------------------------------------------------------------------- @ignore

const RE_SPLIT_IMPORTS = new RegExp(/(?<=\nimport \{ [^\}]+ \} from [^\n]+\n)/);

const RE_ADJ_IMPORTS = new RegExp(/(?<=\n)import \{ ([^\}]+) \} from (\S+);\nimport \{ ([^\}]+) \} from \2;\n/);

/**
 * Merge adjacent simple imports.  (Temporary fix for trivago/prettier-plugin-sort-imports.)
 */
function mergeSimpleImports(code: string, options: any): string {

    // Split code between imports and rest of the code
    const segs = code.split(RE_SPLIT_IMPORTS);
    const codeBody = segs[segs.length - 1].match(/^import\s+/m) ? '' : segs.pop();
    let importLines = ''.concat(...segs);

    // Merge adjacent imports
    let mergeCount = 0;
    while (importLines.match(RE_ADJ_IMPORTS)) {
        importLines = importLines.replace(RE_ADJ_IMPORTS, 'import { $1, $3 } from $2;\n');
        mergeCount++;
    }

    if (mergeCount === 0) {
        return code;
    }

    // Format multi-line imports
    importLines = format(importLines, { ...options, plugins: [] });

    return importLines + codeBody;
}
    
