import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    },
    base: '/Blog/',
    resolve: {
        alias: {
            '@': join(__dirname, "src"),
        }
    },

})
