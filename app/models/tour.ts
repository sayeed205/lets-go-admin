import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import type { ManyToMany } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import withID from '#models/utils/with_id'
import withTimestamps from '#models/utils/with_timestamps'

export default class Tour extends compose(BaseModel, withID(), withTimestamps()) {
  @column()
  declare name: string

  @column()
  declare description: string

  @column.date()
  declare startDate: DateTime

  @column.date()
  declare endDate: DateTime

  @manyToMany(() => User, {
    pivotColumns: [
      'total_cost',
      'received_amount',
      'discount_amount',
      'adult_count',
      'adult_cost',
      'adult_gst',
      'child_count',
      'child_cost',
      'child_gst',
    ],
  })
  declare users: ManyToMany<typeof User>
}
