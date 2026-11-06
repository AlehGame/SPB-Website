import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

import { cloudflare } from '@cloudflare/vite-plugin'

const DEFAULT_SANITY_PROJECT_ID = 'fy6hrt2t'

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

// Content-Security-Policy в <meta> только в продакшен-сборке (в dev Vite нужны inline-скрипты и websocket).
// Работает на любом хостинге, в том числе там, где нельзя настроить HTTP-заголовки.
function contentSecurityPolicy(env: Record<string, string>): Plugin {
  const origin = (url?: string) => (url ? new URL(url).origin : '')
  const sanityApi = `https://${env.VITE_SANITY_PROJECT_ID || DEFAULT_SANITY_PROJECT_ID}.apicdn.sanity.io`
  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    // React и GSAP задают стили через атрибут style
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://cdn.sanity.io",
    "media-src 'self' blob: https://cdn.sanity.io",
    // Vite встраивает мелкие шрифты в CSS как data:
    "font-src 'self' data:",
    `connect-src 'self' ${sanityApi} ${origin(env.VITE_CONTACT_ENDPOINT)}`.trim(),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: policy }, injectTo: 'head-prepend' },
    ],
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/?$/, '/')

  return {
    // Относительные пути, чтобы сайт работал на GitHub Pages в подпапке /<repo>/
    base: './',
    plugins: [react(), tailwindcss(), seoFiles(siteUrl), contentSecurityPolicy(env), cloudflare()],
  }
})
