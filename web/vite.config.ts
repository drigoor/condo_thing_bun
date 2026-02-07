import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";

const API_VERSION = "v1";

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, `/api/${API_VERSION}`),
      },
    },
  },
});
