// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Globale Ignore patterns, falls nötig
  {
    ignores: ["dist", "node_modules"],
  },

  // Basis JS Regeln von ESLint
  js.configs.recommended,

  // TypeScript ESLint Standardkonfiguration
  ...tseslint.configs.recommended,

  // Projekt spezifische Anpassungen
  {
    files: ["src/**/*.{ts,tsx,js,mjs,cjs}"],
    languageOptions: {
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        project: "./tsconfig.json", // optional, falls du type aware linting willst
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
      // weitere projektspezifische Regeln bei Bedarf
    },
  }
);
