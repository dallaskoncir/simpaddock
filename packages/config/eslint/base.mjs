import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

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
);
