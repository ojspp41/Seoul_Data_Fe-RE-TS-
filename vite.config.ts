import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 또는 '/' ← Vercel에서는 일반적으로 '/'도 OK
})
