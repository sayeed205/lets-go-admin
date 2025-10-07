import { BaseSchema } from '@adonisjs/lucid/schema'
import { UserRoleEnum } from '#enums/user'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.raw('DROP TYPE IF EXISTS user_role_enum')
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 25).primary()
      table.string('name').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').nullable()
      table.string('phone_number').nullable()
      table.timestamp('verified_at').nullable()
      table
        .enum('role', Object.values(UserRoleEnum), {
          schemaName: 'public',
          enumName: 'user_role_enum',
          useNative: true,
          existingType: false,
        })
        .notNullable()
        .defaultTo(UserRoleEnum.USER)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.raw('DROP TYPE IF EXISTS user_role_enum')
    this.schema.dropTable(this.tableName)
  }
}
