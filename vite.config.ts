import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
      external: [
        // Add Firebase and other potential external dependencies
        'firebase',
        'firebase/app',
        'firebase/auth',
        'firebase/firestore',
        'firebase/analytics',
        'firebase/messaging',
        // Add other common external dependencies that might cause issues
        'electron',
        'fs',
        'path',
        'os',
        'crypto',
        'stream',
        'util',
        'buffer',
        'events',
        'url',
        'querystring',
        'http',
        'https',
        'net',
        'tls',
        'zlib',
        'child_process'
      ]
    },
  },
  base: './',
  define: {
    // Define global variables to prevent undefined errors
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: [
      'firebase',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore'
    ]
  },
  resolve: {
    alias: {
      // Add aliases for Node.js modules that might be referenced
      buffer: 'buffer',
      process: 'process/browser',
      util: 'util',
    }
  }
});

