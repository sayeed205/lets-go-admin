import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { DateTime } from 'luxon'

import type { UserRoleEnum } from '#enums/user'

import withID from '#models/utils/with_id'
import withTimestamps from '#models/utils/with_timestamps'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder, withID(), withTimestamps()) {
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    type: 'Bearer',
    expiresIn: '30d',
  })

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string | null

  @column()
  declare role: UserRoleEnum

  @column.dateTime({ serializeAs: null })
  declare verifiedAt: DateTime | null

  @computed()
  get isVerified() {
    return !!this.verifiedAt
  }
}
