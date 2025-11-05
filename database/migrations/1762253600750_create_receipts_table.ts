import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'receipts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('tour_user_id', 25).notNullable().references('id').inTable('tour_user')
      table.date('date').notNullable()
      table.integer('amount').notNullable()
      table.string('method', 255).notNullable()
      table.string('method_info', 255).nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
