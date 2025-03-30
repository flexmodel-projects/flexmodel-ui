import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/fm-ui",
  plugins: [react(), svgr({ svgrOptions: { icon: true } })],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/fm-api": {
        target: `http://localhost:8080`,
      },
    },
  },
});
