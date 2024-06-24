import type { SupportOptions } from "prettier";

export const options: SupportOptions = {
    returnParentheses: {
        category: "Format",
        type: "boolean",
        default: false,
        since: "0.6.1",
        description: "Don't wrap multi-line 'return' values in parentheses.",
        oppositeDescription: "Wrap multi-line 'return' values in parentheses.",
    },
};
