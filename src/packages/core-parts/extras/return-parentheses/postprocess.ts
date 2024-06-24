import { stripReturnParentheses } from "./strip-return-paren";

interface ReturnParenthesesOptions {
    returnParentheses?: boolean;
}

let returnParentheses = false;

function setOptions(options: ReturnParenthesesOptions) {
    returnParentheses = options.returnParentheses ?? returnParentheses;
}

// RegExp for "return (\n" in file
const RE_RETURN_PARENTHESIS = /(?:^|(?<=\n))\s*return\s+\(\s*\n/;

export function postprocess(code: string, options: any): string {
    setOptions(options);

    const detectReturnParenthesis = RE_RETURN_PARENTHESIS.test(code);
    if (!returnParentheses && detectReturnParenthesis) {
        return stripReturnParentheses(code);
    }

    return code;
}
