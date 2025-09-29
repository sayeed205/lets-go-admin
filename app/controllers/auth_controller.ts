import { SwaggerInfo, SwaggerRequestBody, SwaggerResponse } from 'adonis-open-swagger'
import { AccessToken } from '@adonisjs/auth/access_tokens'

import type { HttpContext } from '@adonisjs/core/http'

import { loginBody, loginValidator } from '#validators/auth_validator'
import User from '#models/user'
import vine from '@vinejs/vine'

export default class AuthController {
  @SwaggerInfo({
    tags: ['Auth'],
    summary: 'Log in a user',
    description: 'Login to your account',
  })
  @SwaggerRequestBody('Login body', loginBody, true)
  @SwaggerResponse(200, 'Successful login', AccessToken)
  @SwaggerResponse(401, 'Invalid credentials', vine.object({ message: vine.string() }))
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
