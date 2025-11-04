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

/*
|--------------------------------------------------------------------------
| Tours Routes
|--------------------------------------------------------------------------
*/
const ToursController = () => import('#controllers/tours_controller')
router
  .resource('api/tours', ToursController)
  .apiOnly()
  .except(['destroy'])
  .as('tours')
  .use('*', middleware.auth())
router
  .group(() => {
    router.post('/', [ToursController, 'addUser']).as('users.create')
    router.patch('/:id', [ToursController, 'updateTourUser']).as('users.update')
  })
  .use(middleware.auth())
  .prefix('api/tours/users')
  .as('tours')

/*
|--------------------------------------------------------------------------
| Users Routes
|--------------------------------------------------------------------------
*/
const UsersController = () => import('#controllers/users_controller')
router
  .resource('api/users', UsersController)
  .apiOnly()
  .except(['destroy'])
  .as('users')
  .use('*', middleware.auth())

/*
|--------------------------------------------------------------------------
| Vouchers Routes
|--------------------------------------------------------------------------
*/
// const VouchersController = () => import('#controllers/vouchers_controller')
// router
//   .group(() => {
//     router.get('/', [VouchersController, 'index']).as('index')
//     router.post('/', [VouchersController, 'store']).as('store')
//     router.get('/:id', [VouchersController, 'show']).as('show')
//     router.patch('/:id', [VouchersController, 'update']).as('update')
//     router.delete('/:id', [VouchersController, 'destroy']).as('destroy')
//
//     // Get vouchers for a specific tour booking
//     router.get('/tour-user/:tourUserId', [VouchersController, 'getByTourUser']).as('byTourUser')
//   })
//   .as('vouchers')
//   .prefix('/vouchers')
