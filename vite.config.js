import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173,

    allowedHosts: [
      "spygamefrontend.onrender.com"
    ],

    proxy: {
      "/api": {
        target: "https://spygamebackend-4z6x.onrender.com",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "https://spygamebackend-4z6x.onrender.com",
        ws: true,
      },
    },
  },
});
