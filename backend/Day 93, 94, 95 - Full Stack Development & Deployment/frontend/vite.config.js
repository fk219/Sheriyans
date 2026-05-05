import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    hmr: {
      clientPort: 443,
    },
    allowedHosts: ["nx5kyy-5173.csb.app"],
  },
});
