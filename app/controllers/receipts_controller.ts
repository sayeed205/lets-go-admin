import type { HttpContext } from '@adonisjs/core/http'
import Receipt from '#models/receipt'
import { createReceiptValidator, updateReceiptValidator } from '#validators/receipt_validator'
import db from '@adonisjs/lucid/services/db'
import Tour from '#models/tour'
import User from '#models/user'

export default class ReceiptsController {
  async index({ params, response }: HttpContext) {
    const receipts = await Receipt.query().where('tour_user_id', params.id)

    return response.ok({
      message: 'Receipts list.',
      data: receipts,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createReceiptValidator)
    const receipt = await Receipt.create(payload)

    return response.created({
      message: 'Receipt created successfully.',
      data: receipt,
    })
  }

  async show({ params, response }: HttpContext) {
    const receipt = await Receipt.query().where('id', params.id).firstOrFail()
    // Try loading relations like voucher show if appropriate
    const tu = await db.from('tour_user').where('id', receipt.tourUserId).firstOrFail()
    const tour = await Tour.query().where('id', tu.tour_id).withCount('users').first()
    const user = await User.query().where('id', tu.user_id).withCount('tours').first()
    if (!user) return response.notFound()
    if (!tour) return response.notFound()

    return response.ok({
      message: 'Receipt retrieved successfully.',
      data: {
        ...receipt.serialize(),
        user: { ...user.serialize(), toursCount: Number(user.$extras.tours_count) },
        tour: { ...tour.serialize(), usersCount: Number(tour.$extras.users_count) },
      },
    })
  }

  async update({ params, request, response }: HttpContext) {
    const receipt = await Receipt.findOrFail(params.id)
    const payload = await request.validateUsing(updateReceiptValidator)

    receipt.merge(payload)
    await receipt.save()

    return response.ok({
      message: 'Receipt updated successfully.',
      data: receipt,
    })
  }
}
