import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export const base = tseslint.config(
  {
    ignores: [
      "dist/**",
      ".next/**",
      "storybook-static/**",
      "node_modules/**",
      "coverage/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    // Node-executed CJS config files (postcss.config.js, tailwind.config.js, etc.)
    files: ["**/*.config.{js,cjs}"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    // Vitest is configured with `globals: true`, so describe/it/expect/etc.
    // are available without an import in every test file.
    files: ["**/*.test.ts", "**/*.test.tsx"],
    languageOptions: {
      globals: globals.vitest,
    },
  },
);
