import { execSync } from "child_process";
import { resolve, sep } from "path";
import { describe, expect, test } from 'vitest';

const entryPoints = [
  "babel/Counter.jsx",
  "typescript/Counter.tsx",
  "vue/Counter.vue",
];

describe("prettier v3 test using multiple plugins (all compatible with prettier v2 and v3)", () => {
  for (const entry of entryPoints) {
    const filePath = resolve(__dirname, entry).split(sep).join("/");
    const command = `pnpm prettier --check ${filePath}`;

    test(entry, () => {
      let isFormatted = true;

      try {
        execSync(command);
      } catch (error) {
        isFormatted = false;
      }

      expect(isFormatted).toBe(true);
    });
  }
});
