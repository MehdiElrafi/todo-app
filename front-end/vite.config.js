import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: parseInt(process.env.APP_PORT)
  },
  plugins: [react()],
})
