import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tour_user'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 25).primary()
      table
        .string('tour_id', 25)
        .notNullable()
        .references('id')
        .inTable('tours')
        .onDelete('CASCADE')
      table
        .string('user_id', 25)
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('total_cost').notNullable()
      table.integer('received_amount').notNullable().defaultTo(0)
      table.integer('discount_amount').notNullable().defaultTo(0)
      table.smallint('adult_count').notNullable().defaultTo(1)
      table.integer('adult_cost').notNullable().comment('Adult cost per head')
      table.tinyint('adult_gst').notNullable().defaultTo(5)
      table.smallint('child_count').notNullable().defaultTo(0)
      table.integer('child_cost').notNullable().comment('Child cost per head')
      table.tinyint('child_gst').notNullable().defaultTo(5)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['user_id', 'tour_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
