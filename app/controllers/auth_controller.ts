import {
  SwaggerInfo,
  SwaggerRequestBody,
  SwaggerResponse,
  SwaggerSecurity,
} from 'adonis-open-swagger'

import type { HttpContext } from '@adonisjs/core/http'

import { loginBody, loginValidator } from '#validators/auth_validator'
import User from '#models/user'
import { messageBody } from '#dtos/common_dto'
import { getMeResponse, loginResponse } from '#dtos/auth_dto'

export default class AuthController {
  @SwaggerInfo({
    tags: ['Auth'],
    summary: 'Login',
    description: 'Login to your account using email and password.',
  })
  @SwaggerRequestBody('Login body', loginBody, true)
  @SwaggerResponse(200, 'Successful login', loginResponse)
  @SwaggerResponse(401, 'Invalid credentials', messageBody)
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

  @SwaggerInfo({
    tags: ['Auth'],
    summary: 'Logout',
    description: 'Logout a user',
  })
  @SwaggerResponse(200, 'Successful logout', messageBody)
  @SwaggerResponse(401, 'Unauthorized access', messageBody)
  @SwaggerSecurity([{ bearerAuth: [] }])
  async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.ok({ message: 'Logout successfully' })
  }

  @SwaggerInfo({
    tags: ['Auth'],
    summary: 'Me',
    description: 'Get information of currently logged in user',
  })
  @SwaggerSecurity([{ bearerAuth: [] }])
  @SwaggerResponse(200, 'Successful user', getMeResponse)
  @SwaggerResponse(401, 'Unauthorized access', messageBody)
  async me({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    return response.ok({ message: 'Retried logged in user', data: user })
  }
}
