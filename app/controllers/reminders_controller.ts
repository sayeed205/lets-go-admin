import type { HttpContext } from '@adonisjs/core/http'
import Reminder from '#models/reminder'

export default class RemindersController {
  /**
   * Get all reminders for the authenticated user
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const reminders = await Reminder.query()
      .where('userId', user.id)
      .orderBy('reminderDateTime', 'asc')

    return response.ok({
      message: 'Reminders list',
      data: reminders,
    })
  }

  /**
   * Get upcoming reminders (next 7 days)
   */
  async upcoming({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const now = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)

    const reminders = await Reminder.query()
      .where('userId', user.id)
      .where('isCompleted', false)
      .whereBetween('reminderDateTime', [now, nextWeek])
      .orderBy('reminderDateTime', 'asc')

    return response.ok({
      message: 'Upcoming reminders',
      data: reminders,
    })
  }

  /**
   * Get today's reminders
   */
  async today({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const reminders = await Reminder.query()
      .where('userId', user.id)
      .whereBetween('reminderDateTime', [today, tomorrow])
      .orderBy('reminderDateTime', 'asc')

    return response.ok({
      message: "Today's reminders",
      data: reminders,
    })
  }

  /**
   * Create a new reminder
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = request.only([
      'voucherId',
      'tourUserId',
      'voucherName',
      'tourName',
      'userName',
      'reminderDateTime',
      'note',
    ])

    const reminder = await Reminder.create({
      ...payload,
      userId: user.id,
      isCompleted: false,
      isSent: false,
    })

    return response.created({
      message: 'Reminder created successfully',
      data: reminder,
    })
  }

  /**
   * Get a specific reminder
   */
  async show({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const reminder = await Reminder.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    return response.ok({
      message: 'Reminder retrieved successfully',
      data: reminder,
    })
  }

  /**
   * Update a reminder
   */
  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const reminder = await Reminder.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const payload = request.only([
      'voucherName',
      'tourName',
      'userName',
      'reminderDateTime',
      'note',
      'isCompleted',
      'tourUserId',
    ])

    reminder.merge(payload)
    await reminder.save()

    return response.ok({
      message: 'Reminder updated successfully',
      data: reminder,
    })
  }

  /**
   * Delete a reminder
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const reminder = await Reminder.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    await reminder.delete()

    return response.ok({
      message: 'Reminder deleted successfully',
    })
  }

  /**
   * Mark reminder as completed
   */
  async markCompleted({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const reminder = await Reminder.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    reminder.merge({ isCompleted: true })
    await reminder.save()

    return response.ok({
      message: 'Reminder marked as completed',
      data: reminder,
    })
  }
}