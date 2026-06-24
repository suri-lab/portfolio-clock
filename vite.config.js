import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // Electron의 file:// 프로토콜에서 상대 경로 로드 필수
})
