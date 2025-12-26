import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Security: Remove console statements in production
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console.* statements in production build
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  esbuild: {
    // Remove console.log in production during build
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
