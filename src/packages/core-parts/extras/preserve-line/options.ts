import type { SupportOptions } from "prettier";

export const options: SupportOptions = {
    preserveFirstBlankLine: {
        category: "Format",
        type: "boolean",
        default: true,
        since: "0.6.1",
        description: "Preserve first blank line of a block.",
        oppositeDescription: "Do not preserve first blank line of a block, Prettier's default behavior.",
    },
    preserveLastBlankLine: {
        category: "Format",
        type: "boolean",
        default: true,
        since: "0.6.1",
        description: "Preserve last blank line of a block.",
        oppositeDescription: "Do not preserve last blank line of a block, Prettier's default behavior.",
    },
    preserveEolMarker: {
        category: "Format",
        type: "boolean",
        default: true,
        since: "0.6.1",
        description: "Preserve a line if it ends with '//', by applying '// prettier-ignore' to the line.",
        oppositeDescription: "End-of-line '//' is treated as usual by Prettier.",
    },
    preserveDotChain: {
        category: "Format",
        type: "boolean",
        default: true,
        since: "0.6.1",
        description: "Preserve line separation of .chain() method calls.",
        oppositeDescription: "Do not preserve line separation of .chain() method calls, Prettier's default behavior.",
    },
};
