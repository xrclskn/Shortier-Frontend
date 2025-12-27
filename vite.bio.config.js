import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";

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
        outDir: '../shortier_redirect/public/bio',
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
