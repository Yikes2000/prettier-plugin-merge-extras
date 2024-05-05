import type { SupportOptions } from 'prettier';

export const options: SupportOptions = {
  mergeSimpleImports: {
    category: 'Format',
    type: "boolean",
    default: true,
    description: "Merge adjacent simple imports.",
  }
};
