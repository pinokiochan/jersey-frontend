import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "all", // OR just allow the ngrok domain specifically:
      "bc93-2-75-16-92.ngrok-free.app"
    ],
    strictPort: true
  },
})
