import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "android/**",
      "public/**",
    ],
  },
  {
    rules: {
      // Cosmetic JSX-text quoting rule; apostrophes in copy are not bugs.
      "react/no-unescaped-entities": "off",
      // The web version uses `any` for Supabase/Gemini payloads; report it without failing the build.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
