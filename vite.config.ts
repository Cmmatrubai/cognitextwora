import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://cognitext.feeltiptop.com',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: 'https://cognitext.feeltiptop.com',
          Referer: 'https://cognitext.feeltiptop.com/'
        }
      }
    }
  }
})
