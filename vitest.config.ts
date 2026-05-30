import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Dedicated Vitest config so the unit tests don't spin up the `/pets` dev
// middleware. Uses jsdom for component/hook tests and a setup file to register
// jest-dom matchers.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
  },
})
