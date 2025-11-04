import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import withID from '#models/utils/with_id'
import withTimestamps from '#models/utils/with_timestamps'

export default class Voucher extends compose(BaseModel, withID(), withTimestamps()) {
  @column()
  declare tourUserId: string

  @column()
  declare bookingId: string

  @column.date()
  declare date: DateTime

  @column()
  declare subBookingType: string

  @column()
  declare propertyName: string

  @column()
  declare address: string

  @column.date()
  declare checkinDate: DateTime

  @column.date()
  declare checkoutDate: DateTime

  @column()
  declare serviceType: string

  @column()
  declare meal: string

  @column()
  declare payment: string

  @column()
  declare confirmedBy: string

  @column()
  declare serviceContact: string

  @column()
  declare confirmerContact: string
}
