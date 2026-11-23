import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vitepress'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/software-testing/' : '/',
  title: 'Software Testing',
  description: 'Giáo trình Kiểm thử Phần mềm',
  lang: 'vi-VN',
  ignoreDeadLinks: true,

  // Phục vụ trực tiếp file README.md làm trang chủ (/)
  rewrites: {
    'README.md': 'index.md'
  },

  vite: {
    plugins: [
      {
        name: 'ignore-missing-assets',
        resolveId(source, importer) {
          if (
            importer &&
            source.startsWith('.') &&
            /\.(png|jpe?g|gif|svg|webp)$/i.test(source)
          ) {
            const resolved = path.resolve(path.dirname(importer), source)
            if (!fs.existsSync(resolved)) {
              return `\0missing-asset:${source}`
            }
          }
          return null
        },
        load(id) {
          if (id.startsWith('\0missing-asset:')) {
            return `export default ${JSON.stringify(id.slice('\0missing-asset:'.length))}`
          }
          return null
        }
      }
    ]
  },

  // Giao diện sáng mặc định
  appearance: true,

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap'
      }
    ]
  ],

  markdown: {
    // Bật hỗ trợ biểu thức toán học LaTeX ($...$ và $$...$$)
    math: true,
    // Hiển thị số dòng cho code block
    lineNumbers: true,
    // Theme code highlighting sáng đẹp mắt
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    config(md) {
      const defaultFence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        if (token.info.trim() === 'mermaid') {
          const encoded = encodeURIComponent(token.content)
          return `<Mermaid code="${encoded}" />`
        }
        return defaultFence(tokens, idx, options, env, self)
      }
    }
  },

  themeConfig: {
    // Ẩn thanh mục lục nổi bên phải vì mục lục đã đặt ngay sau trang bìa
    aside: false,
    nav: [],
    returnToTopLabel: 'Về đầu trang'
  }
})
