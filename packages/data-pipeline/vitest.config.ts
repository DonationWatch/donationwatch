import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
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
    exclude: [...configDefaults.exclude],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
