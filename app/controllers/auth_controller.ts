import type { HttpContext } from '@adonisjs/core/http'

import { loginValidator } from '#validators/auth_validator'
import User from '#models/user'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    try {
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)
      return response.ok({ message: 'Login successful', data: token })
    } catch {
      return response.unauthorized({ message: 'Invalid Credentials' })
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.ok({ message: 'Logout successfully' })
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    return response.ok({ message: 'Retried logged in user', data: user })
  }
}
