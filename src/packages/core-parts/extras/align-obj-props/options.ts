import type { SupportOptions } from 'prettier';

export const options: SupportOptions = {
  alignObjectProperties: {
    category: 'Format',
    type: "string",
    default: "colon",
    description: "Align object properties.",
  },
  alignSingleProperty: {
    category: 'Format',
    type: "boolean",
    default: false,
    description: "Add space around colon even for objects of single property.",
  }
};
