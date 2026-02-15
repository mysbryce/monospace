import preact from '@preact/preset-vite'
import type { UserConfig } from 'vite'

// https://vite.dev/config/
export const preactConfig = {
  plugins: [preact()],
  base: './',
  build: {
    emptyOutDir: true,
    outDir: './dist'
  }
} as UserConfig