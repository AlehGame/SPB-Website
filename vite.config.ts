import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Относительные пути, чтобы сайт работал на GitHub Pages в подпапке /<repo>/
  base: './',
  plugins: [react(), tailwindcss()],
})
