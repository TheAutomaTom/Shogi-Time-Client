import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from "node:url";
import {VitePWA} from 'vite-plugin-pwa'
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  root: "./",
  build: {
    outDir: "dist",
  },
  base: "/ShogiTime/", // For deploying in a subfolder of cpanel
  publicDir: "public",  
    /* 
    For relative import paths,
    remember to update tsconfig.ts, as well.
    */
  resolve: {
    alias: {
      // src:"/src"
      "@": path.resolve(__dirname,"./src" ),
      "@Config": path.resolve(__dirname,"./src/Config" ),
      "@Styles": path.resolve(__dirname,"./src/Config/Styles" ),
      "@Services": path.resolve(__dirname,"./src/Services" ),
      "@State": path.resolve(__dirname,"./src/State" ),
      "@Views": path.resolve(__dirname,"./src/Views" ),
      "@Components": path.resolve(__dirname,"./src/ViewComponents" ),
    }
  },
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
