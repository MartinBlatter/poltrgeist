import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: 'examples',
  resolve: {
    alias: {
      poltrgeist: path.resolve(__dirname, 'packages/core/src/index.ts'),
    },
  },
})
