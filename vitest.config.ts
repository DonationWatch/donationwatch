import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "remove-sourcemaps",
      transform(code) {
        return {
          code,
          map: { mappings: "" },
        };
      },
    },
  ],
  test: {
    environment: "jsdom",
    exclude: [...configDefaults.exclude],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
    alias: {
      // match tsconfig path alias
      "@/": new URL("./src/", import.meta.url).pathname,
    },
  },
});
