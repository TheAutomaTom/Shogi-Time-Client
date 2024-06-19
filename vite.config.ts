import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {VitePWA} from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  root: "./",
  build: {
    outDir: "dist",
  },
  // base: "/Pwa-Test-Harness/", // For deploying in a subfolder of cpanel
  publicDir: "public",
  plugins: [
    vue(),
    VitePWA({
      injectRegister: 'auto', // https://vite-pwa-org.netlify.app/guide/register-service-worker.html
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']

      },
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Shogi-Time',
        short_name: 'ShogiTime',
        description: 'Our favorite Shogi app ✌️',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icons/192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})
