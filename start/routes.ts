/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import { middleware } from '#start/kernel'

/*
|--------------------------------------------------------------------------
| DOCS Routes
|--------------------------------------------------------------------------
*/
const DocsController = () => import('#controllers/docs_controller')
router
  .group(() => {
    router.get('/docs', [DocsController, 'index']).as('index')
    router.get('/docs.json', [DocsController, 'json']).as('json')
  })
  .as('docs')
  .prefix('api')

/*
|--------------------------------------------------------------------------
| AUTH Routes
|--------------------------------------------------------------------------
*/
const AuthController = () => import('#controllers/auth_controller')
router
  .group(() => {
    router.post('login', [AuthController, 'login']).as('login')
    router.post('logout', [AuthController, 'logout']).as('logout').use(middleware.auth())
    router.get('me', [AuthController, 'me']).as('me').use(middleware.auth())
  })
  .as('auth')
  .prefix('api/auth')
