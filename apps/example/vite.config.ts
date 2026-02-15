import { preactConfig } from '@repo/vite-config'
import { defineConfig, type UserConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  ...(preactConfig as UserConfig),
})
