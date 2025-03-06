import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envConfig = loadEnv(mode, process.cwd())

  return {
    plugins: [vue(), tailwindcss(), vueJsx()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 7843,
      proxy: {
        '/api': {
          target: envConfig.VITE_APP_BASE_API,
          ws: true,
          secure: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    esbuild: {
      drop: mode !== 'development' ? ['console', 'debugger'] : undefined,
    },
  }
})
