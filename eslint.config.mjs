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
    },
  },
];

export default eslintConfig;
