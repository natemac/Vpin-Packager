import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Production-optimized Vite config for GitHub Pages
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  base: "/YOUR_REPOSITORY_NAME/", // Replace with your actual repository name
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});