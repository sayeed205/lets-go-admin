import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reminders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 25).primary()
      table.string('user_id', 25).notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('voucher_id', 25).nullable().references('id').inTable('vouchers').onDelete('CASCADE')
      table.string('voucher_name').notNullable()
      table.string('tour_name').notNullable()
      table.string('user_name').notNullable()
      table.timestamp('reminder_date_time').notNullable()
      table.text('note').nullable()
      table.boolean('is_completed').defaultTo(false)
      table.boolean('is_sent').defaultTo(false)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.index('user_id')
      table.index('voucher_id')
      table.index('reminder_date_time')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}