import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  base: '/jersey-frontend/', // 👈 Добавлено для GitHub Pages
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "all",
      "bc93-2-75-16-92.ngrok-free.app"
    ],
    strictPort: true
  }
})
