import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    globals: true,           // permet d'utiliser describe/it/expect sans import
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
  },
});
