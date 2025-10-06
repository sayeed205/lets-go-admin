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
| AUTH Routes
|--------------------------------------------------------------------------
*/
// const AuthController = () => import('#controllers/auth_controller')
router
  .group(() => {
    router.post('login', '#controllers/auth_controller.login').as('login')
    router.post('logout', '#controllers/auth_controller.logout').as('logout').use(middleware.auth())
    router.get('me', '#controllers/auth_controller.me').as('me').use(middleware.auth())
  })
  .as('auth')
  .prefix('api/auth')
