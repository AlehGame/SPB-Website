import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

import { cloudflare } from "@cloudflare/vite-plugin";

// Адрес сайта задаётся в .env (VITE_SITE_URL): canonical, Open Graph, robots.txt и sitemap.xml берут его отсюда
const DEFAULT_SITE_URL = 'https://alehgame.github.io/SPB-Website/'

// robots.txt и sitemap.xml генерируются при сборке, чтобы адрес был в одном месте
function seoFiles(siteUrl: string): Plugin {
  return {
    name: 'seo-files',
    apply: 'build',
    generateBundle() {
      const lastmod = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/?$/, '/')

  return {
    // Относительные пути, чтобы сайт работал на GitHub Pages в подпапке /<repo>/
    base: './',
    plugins: [react(), tailwindcss(), seoFiles(siteUrl), cloudflare()],
  };
})