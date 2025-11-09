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
    const tu = await db.from('tour_user').where('id', payload.tourUserId).first()
    const { total: oldTotal = 0 } = (await db
      .from('receipts')
      .where('tour_user_id', payload.tourUserId)
      .sum('amount as total')
      .first()) || { total: 0 }
    const newTotal = oldTotal + payload.amount
    if (newTotal > tu.total_cost - tu.discount_amount)
      return response.badRequest({
        message: 'Can not exceed total cost',
        data: {
          totalCost: tu.total_cost,
          totalReceiving: newTotal,
          discount: tu.discount_amount,
          due: tu.total_cost - tu.discount_amount - oldTotal,
        },
      })

    const receipt = await Receipt.create(payload)
    await db
      .from('tour_user')
      .where('id', payload.tourUserId)
      .update({ received_amount: oldTotal + receipt.amount })

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

    // Determine the new amount (if not provided, keep existing amount)
    const newAmount = (payload as any).amount ?? receipt.amount

    // Sum of all other receipts for this tour user (excluding this receipt)
    const { total: othersTotal = 0 } = (await db
      .from('receipts')
      .where('tour_user_id', receipt.tourUserId)
      .whereNot('id', receipt.id)
      .sum('amount as total')
      .first()) || { total: 0 }

    // Fetch tour user to validate limits
    const tu = await db.from('tour_user').where('id', receipt.tourUserId).first()
    if (!tu) return response.notFound({ message: 'Tour user not found.' })

    const newTotal = Number(othersTotal) + Number(newAmount)
    const limit = Number(tu.total_cost) - Number(tu.discount_amount)

    if (newTotal > limit) {
      return response.badRequest({
        message: 'Can not exceed total cost',
        data: {
          totalCost: tu.total_cost,
          totalReceiving: newTotal,
          discount: tu.discount_amount,
          due: limit - Number(othersTotal),
        },
      })
    }

    // Persist the receipt changes
    receipt.merge(payload)
    await receipt.save()

    // Update aggregate received amount on tour_user
    await db
      .from('tour_user')
      .where('id', receipt.tourUserId)
      .update({ received_amount: Number(othersTotal) + Number(receipt.amount) })

    return response.ok({
      message: 'Receipt updated successfully.',
      data: receipt,
    })
  }
}
