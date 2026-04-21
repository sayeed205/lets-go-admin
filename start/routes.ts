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
const DocsController = () => import('#controllers/docs_controller')
const ToursController = () => import('#controllers/tours_controller')
const UsersController = () => import('#controllers/users_controller')
const VouchersController = () => import('#controllers/vouchers_controller')
const ReceiptController = () => import('#controllers/receipts_controller')
const RemindersController = () => import('#controllers/reminders_controller')
const DeviceTokensController = () => import('#controllers/device_tokens_controller')

/*
|--------------------------------------------------------------------------
| DOCS Routes
|--------------------------------------------------------------------------
*/
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
router.resource('api/tours', ToursController).apiOnly().as('tours').use('*', middleware.auth())

/*
|--------------------------------------------------------------------------
| Users Routes
|--------------------------------------------------------------------------
*/
router.resource('api/users', UsersController).apiOnly().as('users').use('*', middleware.auth())

/*
|--------------------------------------------------------------------------
| Vouchers Routes
|--------------------------------------------------------------------------
*/
router
  .resource('api/vouchers', VouchersController)
  .apiOnly()
  .only(['store', 'show', 'update'])
  .as('vouchers')
  .use('*', middleware.auth())

/*
|--------------------------------------------------------------------------
| Receipts Routes
|--------------------------------------------------------------------------
*/
router
  .resource('api/receipts', ReceiptController)
  .apiOnly()
  .only(['store', 'show', 'update'])
  .as('receipts')
  .use('*', middleware.auth())

/*
|--------------------------------------------------------------------------
| Tour User Routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.post('/', [ToursController, 'addUser']).as('users.create')
    router.patch('/:id', [ToursController, 'updateTourUser']).as('users.update')
    router.get('/:id', [ToursController, 'showTourUser']).as('users.show')
    router.get('/:id/vouchers', [VouchersController, 'index']).as('users.vouchers.index')
    router.get('/:id/receipts', [ReceiptController, 'index']).as('users.receipts.index')
  })
  .use(middleware.auth())
  .prefix('api/tour-user')
  .as('tours')

/*
|--------------------------------------------------------------------------
| Reminders Routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('/', [RemindersController, 'index']).as('index')
    router.get('/upcoming', [RemindersController, 'upcoming']).as('upcoming')
    router.get('/today', [RemindersController, 'today']).as('today')
    router.post('/', [RemindersController, 'store']).as('store')
    router.get('/:id', [RemindersController, 'show']).as('show')
    router.put('/:id', [RemindersController, 'update']).as('update')
    router.delete('/:id', [RemindersController, 'destroy']).as('destroy')
    router.patch('/:id/complete', [RemindersController, 'markCompleted']).as('complete')
  })
  .use(middleware.auth())
  .prefix('api/reminders')
  .as('reminders')

/*
|--------------------------------------------------------------------------
| Device Tokens Routes (FCM)
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('/', [DeviceTokensController, 'index']).as('index')
    router.post('/', [DeviceTokensController, 'store']).as('store')
    router.delete('/:id', [DeviceTokensController, 'destroy']).as('destroy')
  })
  .use(middleware.auth())
  .prefix('api/devices')
  .as('devices')
