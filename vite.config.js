import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 💡 این خط مهم است: باعث می‌شود فایل‌ها با آدرس نسبی لود شوند
})