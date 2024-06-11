import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure this is set correctly
  },
  server: {
    port: 8000,
    proxy: {
      "/api": {
        // target: "http://localhost:5000",
		target:"https://b44158cf-078d-4d69-9231-b0ecd61b8a81-00-krv9adj2bcg5.pike.replit.dev/",
        changeOrigin: true,
      },
    },
  },
});
