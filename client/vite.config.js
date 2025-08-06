import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  // Add this line. It's the only change you need.
  base: '/', 
  
  plugins: [react()],
  server: {
    hmr: {
      port: 5173, // Try explicitly setting the HMR port
    }
  }
})
