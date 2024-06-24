import type { SupportOptions } from "prettier";

export const options: SupportOptions = {
    playwrightClickGrouping: {
        category: "Format",
        type: "boolean",
        default: false,
        since: "0.6.1",
        description: "Insert a blank line before 'await ...click()'.",
        oppositeDescription: "Do not insert a blank line before 'await ...click()'.",
    },
};
