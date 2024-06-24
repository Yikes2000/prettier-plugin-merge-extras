import type { SupportOptions } from "prettier";

export const options: SupportOptions = {
    mergeSimpleImports: {
        category: "Format",
        type: "boolean",
        default: true,
        since: "0.6.1",
        description: "Merge adjacent simple imports.",
    },
};
