import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Check if we are building for GitHub Pages
  //const isGithubPages = mode === 'github';

  return {
    // Set the base path conditionally
    base: '/DASVFXSTUDIO/',

    plugins: [react()],
    server: {
      hmr: {
        port: 5173,
      }
    }
  };
});