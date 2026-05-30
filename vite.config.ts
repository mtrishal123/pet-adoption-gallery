import { defineConfig, type Plugin, type Connect } from 'vite'
import react from '@vitejs/plugin-react'
import { PETS } from './src/data/pets'

/**
 * Tiny dev/preview middleware that serves the mock pet dataset at `GET /pets`.
 *
 * This lets the front-end issue a real `fetch('/pets')` request — satisfying the
 * spec — without standing up a separate backend. The handler is mounted in both
 * the dev server and the `vite preview` server so the production-style build can
 * be demoed the same way.
 *
 * It matches the path `/pets` *exactly* (ignoring the query string) and lets
 * everything else fall through, so client-side routes such as `/pets/:id` are
 * still handled by the SPA history fallback rather than this API.
 */
function petsApiPlugin(): Plugin {
  const handler: Connect.NextHandleFunction = (req, res, next) => {
    const path = (req.url ?? '').split('?')[0]
    if (req.method !== 'GET' || path !== '/pets') {
      next()
      return
    }

    // A small artificial latency makes the loading/skeleton states observable.
    const delayMs = 450
    setTimeout(() => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
      res.statusCode = 200
      res.end(JSON.stringify(PETS))
    }, delayMs)
  }

  return {
    name: 'pets-api',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), petsApiPlugin()],
})
