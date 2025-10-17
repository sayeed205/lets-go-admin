import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class DocsController {
  async index({ response }: HttpContext) {
    return response.header('content-type', 'text/html').send(`
<!doctype html>
<html>
  <head>
    <title>Scalar API Reference</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <div id="app"></div>
    <!-- Load the Script -->
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    <!-- Initialize the Scalar API Reference -->
    <script>
      Scalar.createApiReference('#app', {
        // The URL of the OpenAPI/Swagger document
        url: 'docs.json',
        // Avoid CORS issues
        proxyUrl: 'https://proxy.scalar.com',
        theme: 'elysiajs',
        hideClientButton: true
      })
    </script>
  </body>
</html>
    `)
  }

  async json({ response }: HttpContext) {
    const { default: data } = await import(app.appRoot + 'swagger.json', { with: { type: 'json' } })
    return response.ok(data)
  }
}
