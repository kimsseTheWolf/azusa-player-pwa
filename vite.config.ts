import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/bili': {
        target: "https://api.bilibili.com",
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api\/bili/, ''),
        headers: {
          Referer: 'https://www.bilibili.com',
          Origin: 'https://www.bilibili.com'
        }
      }
    }
  }
})
