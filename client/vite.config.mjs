/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux', 'redux'],
          'vendor-charts': ['recharts', 'd3'],
        }
      }
    }
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, "./src/components"),
      pages: path.resolve(__dirname, "./src/pages"),
      styles: path.resolve(__dirname, "./src/styles"),
      utils: path.resolve(__dirname, "./src/utils"),
      "inventory-management": path.resolve(__dirname, "./src/inventory-management"),
      "product-details": path.resolve(__dirname, "./src/product-details"),
      collection: path.resolve(__dirname, "./src/collection"),
      homepage: path.resolve(__dirname, "./src/homepage"),
      store: path.resolve(__dirname, "./src/store"),
      config: path.resolve(__dirname, "./src/config"),
    },
  },
  plugins: [
    tsconfigPaths(),
    react(),
    tailwindcss(),
  ],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: false,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
    exclude: ['server/**', 'node_modules/**']
  }
});