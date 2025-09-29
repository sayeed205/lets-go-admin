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

const AuthController = () => import('#controllers/auth_controller')

/*
|--------------------------------------------------------------------------
| AUTH Routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.post('login', [AuthController, 'login']).as('login')
    router.post('logout', [AuthController, 'logout']).as('logout').use(middleware.auth())
  })
  .as('auth')
  .prefix('api/auth')
