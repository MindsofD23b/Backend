// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Global ignore patterns
  {
    ignores: ["dist", "node_modules", "srv"],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript ESLint defaults
  ...tseslint.configs.recommended,

  // Global settings (apply to ALL files, including server.js)
  {
    languageOptions: {
      globals: {
        ...globals.node,   // <-- FIX: makes process & console recognized
      },
    },
  },

  // Project-specific override for source files
  {
    files: ["src/**/*.{ts,tsx,js,mjs,cjs}"],
    languageOptions: {
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" }
      ],
    },
  }
);
