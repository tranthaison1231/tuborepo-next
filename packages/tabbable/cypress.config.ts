import { defineConfig } from "cypress";

export default defineConfig({
  viewportHeight: 600,
  viewportWidth: 800,
  video: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
