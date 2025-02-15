import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path'

const { PORT = 3000 } = process.env;

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: `http://localhost:${PORT}`,
                changeOrigin: true,
            },
            '/auth': {
                target: `http://localhost:${PORT}`,
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: '../dist/app',
        assetsDir: 'assets',
        chunkSizeWarningLimit: 1000, // Increase the warning limit to 1000 kB
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom', 'react-router-dom'],
              // Add other large dependencies here
            },
            assetFileNames: (assetInfo) => {
              let extType = assetInfo.name.split('.').at(1);
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                extType = 'img';
              }
              return `assets/${extType}/[name]-[hash][extname]`;
            },
          },
        },
      },
    })
