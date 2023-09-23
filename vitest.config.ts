import { defineConfig } from "vitest/config";
import * as path from "path";

export default defineConfig({
  test: {},
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})