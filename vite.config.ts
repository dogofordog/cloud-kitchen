import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "./",
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["tests/**/*.{test,spec}.ts"],
          exclude: ["tests/**/*.dom.{test,spec}.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          environment: "jsdom",
          include: ["tests/**/*.dom.{test,spec}.ts"],
        },
      },
    ],
  },
});
