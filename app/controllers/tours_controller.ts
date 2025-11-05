import db from '@adonisjs/lucid/services/db'
import { cuid } from '@adonisjs/core/helpers'
import snakecaseKeys from 'snakecase-keys'

import type { HttpContext } from '@adonisjs/core/http'

import Tour from '#models/tour'
import {
  createTourUserValidator,
  createTourValidator,
  updateTourUserValidator,
  updateTourValidator,
} from '#validators/tour_validator'
import { Infer } from '@vinejs/vine/types'
import User from '#models/user'
import Voucher from '#models/voucher'
import Receipt from '#models/receipt'

export default class ToursController {
  async index({ response }: HttpContext) {
    const tours = await Tour.query().withCount('users')

    return response.ok({
      message: 'List of tours',
      data: tours.map((t) => ({ ...t.serialize(), usersCount: Number(t.$extras.users_count) })),
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTourValidator)
    const tour = await Tour.create(payload)

    return response.created({
      message: 'Tour created successfully.',
      data: { ...tour.serialize(), usersCount: 0 },
    })
  }

  async show({ params, response }: HttpContext) {
    const tour = await Tour.query()
      .where('id', params.id)
      .preload('users', (q) => {
        q.withCount('tours')
      })
      .firstOrFail()
    const data = {
      ...tour.serialize(),
      users: tour.users.map((t) => ({
        ...t.serialize(),
        toursCount: Number(t.$extras.tours_count),
      })),
    }

    return response.ok({
      message: 'Tour retrieved successfully.',
      data,
    })
  }

  async update({ params, request, response }: HttpContext) {
    const tour = await Tour.findOrFail(params.id)
    const payload = await request.validateUsing(updateTourValidator)

    tour.merge(payload)
    await tour.save()

    return response.ok({
      message: 'Tour updated successfully.',
      data: tour,
    })
  }

  async addUser({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTourUserValidator)
    const tu = await db
      .from('tour_user')
      .debug(true)
      .where('user_id', payload.userId)
      .andWhere('tour_id', payload.tourId)
      .first()
    console.log('tu', tu)
    if (tu)
      return response.badRequest({
        message: 'User is already in the tour.',
        data: null,
      })
    await db
      .table('tour_user')
      .returning(['id'])
      .debug(true)
      .insert(
        snakecaseKeys({
          ...payload,
          totalCost: this.calculateTotalCost(payload),
          id: cuid(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      )
    return response.created({
      message: 'User has been added to the tour successfully.',
      data: null,
    })
  }

  async updateTourUser({ request, params, response }: HttpContext) {
    const payload = await request.validateUsing(updateTourUserValidator)

    await db.from('tour_user').where('id', params.id).update(snakecaseKeys(payload))

    return response.ok({
      message: 'Tour updated successfully.',
      data: null,
    })
  }

  async showTourUser({ params, response }: HttpContext) {
    const tu = await db.from('tour_user').where('id', params.id).firstOrFail()
    const tour = await Tour.find(tu.tour_id)
    const user = await User.find(tu.user_id)
    const voucherCount = await Voucher.query().where('tour_user_id', tu.id).count('*')
    const receiptCount = await Receipt.query().where('tour_user_id', tu.id).count('*')
    if (!tour) return response.notFound()
    if (!user) return response.notFound()
    delete tu.user_id
    delete tu.tour_id
    return response.ok({
      message: 'Tour details',
      data: {
        ...tu,
        voucherCount: Number(voucherCount[0].$extras.count),
        receiptCount: Number(receiptCount[0].$extras.count),
        tour,
        user,
      },
    })
  }

  private calculateTotalCost(data: Infer<typeof createTourUserValidator>) {
    const adultSubtotal = data.adultCount * data.adultCost
    const adultGstAmount = data.adultGst ? (adultSubtotal * data.adultGst) / 100 : 0

    const childSubtotal = (data.childCount ?? 0) * (data.childCost ?? 0)
    const childGstAmount = data.childGst ? (childSubtotal * data.childGst) / 100 : 0

    return adultSubtotal + adultGstAmount + childSubtotal + childGstAmount
  }
}
