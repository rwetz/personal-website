// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: "/",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // The 404 game is its own entry: GitHub Pages serves dist/404.html for
  // missing paths, and the portfolio bundle never carries game code.
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        notFound: path.resolve(__dirname, '404.html'),
      },
    },
  },
  plugins: [
    // The production policy upgrades HTTP requests, but Safari applies it to
    // localhost too, where Vite serves plain HTTP. Keep it in built HTML.
    {
      name: 'local-preview-csp',
      apply: 'serve',
      transformIndexHtml: html => html.replace(/;\s*upgrade-insecure-requests/, ''),
    },
    tailwindcss(),
    react(),
  ],
})
