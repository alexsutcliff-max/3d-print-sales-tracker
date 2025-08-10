import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If you're deploying to GitHub Pages under a repo like username/repo,
// set base: '/repo/' below. Otherwise leave it as '/'.
export default defineConfig({
  plugins: [react()],
  base: '/3d-print-sales-tracker/',
})
