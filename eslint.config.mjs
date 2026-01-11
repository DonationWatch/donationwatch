import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import playwright from "eslint-plugin-playwright";
import pluginReact from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import tseslint from "typescript-eslint";
import nextEslint from "@next/eslint-plugin-next";

export default tseslint.config(
  {
    ignores: [
      "**/data/**/*",
      "**/geojson/**/*",
      "**/.donations-cache/**/*",
      "**/.next/**",
    ],
  },

  eslint.configs.recommended,

  // next config
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    ...nextEslint.flatConfig.coreWebVitals,
  },

  // tsx/jsx config
  {
    files: ["**/*.tsx"],
    ...jsxA11y.flatConfigs.recommended,
    rules: {
      "react/jsx-no-useless-fragment": "error",
    },
  },
  {
    files: ["**/*.tsx"],
    ...pluginReact.configs.flat.recommended,
    settings: { react: { version: "detect" } },
  },
  {
    files: ["**/*.tsx"],
    ...pluginReact.configs.flat["jsx-runtime"],
  },
  {
    files: ["**/*.tsx"],
    ...reactCompiler.configs.recommended,
  },

  // ts eslint config
  tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { ignoreRestSiblings: true },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.property.name='sort']",
          message: "Usage of .sort() is disallowed. Use .toSorted() instead.",
        },
        {
          selector: "CallExpression[callee.property.name='reverse']",
          message:
            "Usage of .reverse() is disallowed. Use .toReversed() instead.",
        },
      ],
    },
  },

  // plugin-import
  {
    files: ["**/*.ts", "**/*.tsx"],
    ...importPlugin.flatConfigs.recommended,
    rules: {
      "import/no-duplicates": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          warnOnUnassignedImports: true,
        },
      ],
    },
  },

  // playwright tests
  {
    ...playwright.configs["flat/recommended"],
    files: ["e2e/**/*.test.{ts,tsx}"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "playwright/no-skipped-test": ["error", { allowConditional: true }],
    },
  },
);
