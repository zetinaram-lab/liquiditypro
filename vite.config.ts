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
    // PWA: Generate manifest and service worker
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Optimize bundle splitting for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-toast'],
          'chart-vendor': ['recharts', 'lightweight-charts'],
        },
      },
    },
  },
  esbuild: {
    // Remove console.log in production during build
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
