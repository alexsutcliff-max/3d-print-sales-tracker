import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed to GitHub Pages under /3d-print-sales-tracker/
export default defineConfig({
  plugins: [react()],
  base: '/3d-print-sales-tracker/',
})
