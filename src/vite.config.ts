import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/relatorios': 'http://localhost:8080',
            '/mesas': 'http://localhost:8080',
            '/auth': 'http://localhost:8080',
        },
    },
})
