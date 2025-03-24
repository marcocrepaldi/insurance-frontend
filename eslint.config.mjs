import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Extensões recomendadas
  ...compat.extends("next/core-web-vitals", "next", "next/typescript"),

  // Configuração principal
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    ignores: ["node_modules/", ".next/", "dist/"], // Ignora diretórios desnecessários
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      // ⚠️ Permite variáveis não utilizadas que começam com _
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

      // ⚠️ Pode desativar 'any' e 'Function' enquanto ajusta os tipos
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-this-alias": "off",

      // Recomendado: evita o erro de módulos do Next
      "@next/next/no-assign-module-variable": "off",
    },
  },
];
