import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes asset paths relative so the production build works
// both on Vercel and on GitHub Pages project sites (e.g. /keyflow/).
export default defineConfig({
  plugins: [react()],
  base: './',
})
