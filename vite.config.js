import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    hmr: {
      port: 5173, // Try explicitly setting the HMR port
    }
  }
})

