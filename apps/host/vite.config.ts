import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // The game runs on port 5173, the host on 5180.
  server: { port: 5180, strictPort: true },
});
