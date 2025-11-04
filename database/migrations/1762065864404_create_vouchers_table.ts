import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vouchers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 25).primary()
      table.string('tour_user_id', 25).notNullable().references('id').inTable('tour_user')
      table.string('booking_id').nullable()
      table.date('date').notNullable()
      table.string('sub_booking_type').nullable()
      table.text('property_name').nullable()
      table.text('address').nullable()
      table.date('checkin_date').nullable()
      table.date('checkout_date').nullable()
      table.string('service_type').nullable()
      table.string('meal').nullable()
      table.string('payment').nullable()
      table.string('confirmed_by').nullable()
      table.string('service_contact').nullable()
      table.string('confirmer_contact').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.index('tour_user_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
