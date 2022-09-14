import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsxInject: `import * as React from 'react'`,
  },
  define: {
    __DEV__: true,
  },
  test: {
    environment: "jsdom",
    coverage: {
      include: ["packages/*/__tests__/**/*.{ts,tsx,js,jsx}"],
      exclude: [...configDefaults.exclude],
    },
    setupFiles: ["./test/setupTests.ts"],
  },
});
