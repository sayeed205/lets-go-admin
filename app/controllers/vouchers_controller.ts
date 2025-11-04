import type { HttpContext } from '@adonisjs/core/http'

import Voucher from '#models/voucher'
import { createVoucherValidator, updateVoucherValidator } from '#validators/voucher_validator'
import Tour from '#models/tour'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'

export default class VouchersController {
  async index({ params, response }: HttpContext) {
    const vouchers = await Voucher.query().where('tour_user_id', params.id)

    return response.ok({
      message: 'Vouchers list.',
      data: vouchers,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createVoucherValidator)
    const voucher = await Voucher.create(payload)

    return response.created({
      message: 'Voucher created successfully.',
      data: voucher,
    })
  }

  async show({ params, response }: HttpContext) {
    const voucher = await Voucher.query().where('id', params.id).firstOrFail()
    const tu = await db.from('tour_user').where('id', voucher.tourUserId).firstOrFail()
    const tour = await Tour.query().where('id', tu.tour_id).withCount('users').first()
    const user = await User.query().where('id', tu.user_id).withCount('tours').first()
    if (!user) return response.notFound()
    if (!tour) return response.notFound()

    return response.ok({
      message: 'Booking voucher retrieved successfully.',
      data: {
        ...voucher.serialize(),
        user: { ...user.serialize(), toursCount: Number(user.$extras.tours_count) },
        tour: { ...tour.serialize(), usersCount: Number(tour.$extras.users_count) },
      },
    })
  }

  async update({ params, request, response }: HttpContext) {
    const voucher = await Voucher.findOrFail(params.id)
    const payload = await request.validateUsing(updateVoucherValidator)

    voucher.merge(payload)
    await voucher.save()

    return response.ok({
      message: 'Booking voucher updated successfully.',
      data: voucher,
    })
  }
}
