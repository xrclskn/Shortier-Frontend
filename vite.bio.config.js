import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";
import fs from 'fs';

// Determine the output directory based on environment
const localRedirectPath = '../shortier_redirect/public/bio';
const serverBackendPath = '../backend/public/bio';

let finalOutDir = localRedirectPath;

if (process.env.BIO_OUT_DIR) {
    finalOutDir = process.env.BIO_OUT_DIR;
} else if (fs.existsSync(path.resolve(__dirname, '../backend'))) {
    finalOutDir = serverBackendPath;
}

console.log(`Building Bio to: ${finalOutDir}`);

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    base: '/bio/', // Assets will be served from /bio/
    build: {
        outDir: finalOutDir,
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: path.resolve(__dirname, 'src/bio-main.jsx'),
            output: {
                entryFileNames: 'assets/[name].js', // simplify naming if possible, but hash is good for cache
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        }
    }
})
