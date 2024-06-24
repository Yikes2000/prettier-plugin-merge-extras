import type { SupportOptions } from "prettier";

export const options: SupportOptions = {
    alignObjectProperties: {
        category: "Format",
        type: "string",
        default: "colon",
        since: "0.6.1",
        description: "Align object properties.",
    },
    alignSingleProperty: {
        category: "Format",
        type: "boolean",
        default: true,
        since: "0.6.1",
        description: "Add space around colon even for objects of single property.",
    },
};
