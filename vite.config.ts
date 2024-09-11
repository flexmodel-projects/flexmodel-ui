import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr({svgrOptions: {icon: true}})],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: `http://localhost:8080`
      }
    }
  }
})
