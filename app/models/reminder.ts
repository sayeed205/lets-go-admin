import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import User from '#models/user'
import Voucher from '#models/voucher'
import withID from '#models/utils/with_id'
import withTimestamps from '#models/utils/with_timestamps'

export default class Reminder extends compose(BaseModel, withID(), withTimestamps()) {
  @column()
  declare userId: string

  @column()
  declare voucherId: string | null

  @column()
  declare tourUserId: string | null

  @column()
  declare voucherName: string

  @column()
  declare tourName: string

  @column()
  declare userName: string

  @column.dateTime()
  declare reminderDateTime: DateTime

  @column()
  declare note: string | null

  @column()
  declare isCompleted: boolean

  @column()
  declare isSent: boolean

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Voucher)
  declare voucher: BelongsTo<typeof Voucher>
}
