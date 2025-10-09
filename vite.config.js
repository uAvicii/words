import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173  // 前端使用 5173 端口，后端使用 3000 端口
  }
})
