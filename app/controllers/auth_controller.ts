import type { HttpContext } from '@adonisjs/core/http'

import { loginValidator } from '#validators/auth_validator'
import User from '#models/user'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    try {
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)
      return response.ok({ data: token })
    } catch {
      return response.unauthorized({ message: 'Invalid Credentials' })
    }
  }
}
