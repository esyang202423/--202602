import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 這一行非常重要！它是告訴 Vite 妳的網站是放在 "--202602" 這個資料夾裡
  // 請確認這跟妳 GitHub 專案名稱一模一樣 (我看截圖是 --202602)
  base: '/--202602/',
})
