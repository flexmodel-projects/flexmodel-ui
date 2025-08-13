import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import {fileURLToPath} from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/api/flexmodel-ui',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [react(), svgr({ svgrOptions: { icon: true } })],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: `http://localhost:8080`,
      },
    },
  },
});
