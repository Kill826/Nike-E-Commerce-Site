import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "admin"),
  resolve: {
    alias: {
      "/src": path.resolve(__dirname, "src"),
    },
  },
  build: { outDir: path.resolve(__dirname, "dist-admin") },
  server: {
    port: 5174,
    proxy: {
      '/uploads': 'http://localhost:4000',
    },
  },
});
