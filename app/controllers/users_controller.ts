import { safeEqual } from '@adonisjs/core/helpers'

import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import {
  createUserValidator,
  updateUserValidator,
  userFilterValidator,
  validateMasterKey,
} from '#validators/user_validator'
import env from '#start/env'

export default class UsersController {
  async index({ request, response }: HttpContext) {
    const {
      query,
      sortBy = 'name',
      order = 'asc',
    } = await userFilterValidator.validate(request.qs())
    const users = await User.query()
      .if(query, (q) => {
        q.where((w) => {
          w.whereILike('name', `%${query}%`).orWhereILike('email', `%${query}%`)
        })
      })
      .orderBy(sortBy!, order!)
      .withCount('tours')

    return response.ok({
      message: 'List of users',
      data: users.map((u) => ({ ...u.serialize(), toursCount: Number(u.$extras.tours_count) })),
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    const user = await User.create(payload)

    return response.created({
      message: 'User created successfully.',
      data: { ...user.serialize(), toursCount: 0 },
    })
  }

  async show({ params, response }: HttpContext) {
    const user = await User.query()
      .where('id', params.id)
      .preload('tours', (q) => {
        q.withCount('users')
      })
      .firstOrFail()
    const data = {
      ...user.serialize(),
      tours: user.tours.map((u) => ({
        ...u.serialize(),
        usersCount: Number(u.$extras.users_count),
      })),
    }

    return response.ok({
      message: 'Tour retrieved successfully.',
      data,
    })
  }

  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const payload = await request.validateUsing(updateUserValidator)

    user.merge(payload)
    await user.save()

    return response.ok({
      message: 'User updated successfully.',
      data: user,
    })
  }

  async destroy({ auth, params, request, response }: HttpContext) {
    const { masterKey } = await request.validateUsing(validateMasterKey)
    if (!safeEqual(env.get('MASTER_KEY'), masterKey)) {
      return response.unauthorized({
        message: 'Invalid credentials',
      })
    }
    const authUser = auth.getUserOrFail()

    const user = await User.findOrFail(params.id)
    if (safeEqual(user.id, authUser.id)) {
      return response.badRequest({
        message: 'You can not delete yourself.',
      })
    }
    await user.delete()
    return response.ok({
      message: 'User deleted successfully',
    })
  }
}
