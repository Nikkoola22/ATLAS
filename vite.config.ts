import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Détecte si on build pour GitHub Pages
const isGithubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: isGithubPages ? '/ATLAS/' : '/', // GitHub Pages : /ATLAS/ | Vercel : /
});
