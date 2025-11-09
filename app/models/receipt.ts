import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import withID from '#models/utils/with_id'
import withTimestamps from '#models/utils/with_timestamps'

export default class Receipt extends compose(BaseModel, withID(), withTimestamps()) {
  @column()
  declare tourUserId: string

  @column.date()
  declare date: DateTime

  @column()
  declare amount: number

  @column()
  declare method: string

  @column()
  declare methodInfo: string
}
