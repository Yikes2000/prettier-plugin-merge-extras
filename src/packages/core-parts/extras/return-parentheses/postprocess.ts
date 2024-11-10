import { stripReturnParentheses } from "./strip-return-paren";

interface ReturnParenthesesOptions {
    returnParentheses?: boolean;
}

let returnParentheses = false;

function setOptions(options: ReturnParenthesesOptions) {
    returnParentheses = options.returnParentheses ?? returnParentheses;
}

// RegExp for "return (\n" or "...=> (\n" in file
const RE_RETURN_OR_ARROW_FN_PAREN = /(?:^|(?<=\n))\s*(?:return|[a-zA-Z_][^\n]+\s*=>)\s+\(\s*\n/;

export function postprocess(code: string, options: any): string {
    setOptions(options);

    const detectReturnParenthesis = RE_RETURN_OR_ARROW_FN_PAREN.test(code);
    if (!returnParentheses && detectReturnParenthesis) {
        return stripReturnParentheses(code, options);
    }

    return code;
}
