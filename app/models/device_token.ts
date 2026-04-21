import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import User from '#models/user'
import withID from '#models/utils/with_id'
import withTimestamps from '#models/utils/with_timestamps'

export default class DeviceToken extends compose(BaseModel, withID(), withTimestamps()) {
  @column()
  declare userId: string

  @column()
  declare fcmToken: string

  @column()
  declare deviceId: string

  @column()
  declare deviceName: string | null

  @column()
  declare platform: 'android' | 'ios'

  @column.dateTime()
  declare lastUsedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}