import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { schedule } from 'adonisjs-scheduler'
import Reminder from '#models/reminder'
import FcmService from '#services/fcm_service'

@schedule((s) => s.everyMinute())
export default class SendNotification extends BaseCommand {
  static commandName = 'send:notification'
  static description = 'Send due reminder notifications and cleanup old reminders'

  static options: CommandOptions = { startApp: true }

  async run() {
    const fcmService = new FcmService()
    const now = new Date()

    // 1. Find reminders that are due and not yet sent
    const dueReminders = await Reminder.query()
      .where('isSent', false)
      .where('isCompleted', false)
      .where('reminderDateTime', '<=', now)

    this.logger.info(`Found ${dueReminders.length} due reminders`)

    // 2. Send notifications for each due reminder
    for (const reminder of dueReminders) {
      try {
        await fcmService.sendToUser(reminder.userId, {
          title: reminder.voucherName.startsWith('Payment Due:') ? 'Payment Reminder' : 'Voucher Reminder',
          body: `${reminder.userName} - ${reminder.voucherName} (${reminder.tourName})`,
          data: {
            reminderId: reminder.id,
            type: 'reminder',
          },
        })

        // Mark as sent
        reminder.isSent = true
        await reminder.save()

        this.logger.info(`Sent notification for reminder: ${reminder.id}`)
      } catch (error) {
        this.logger.error(`Failed to send notification for reminder: ${reminder.id}`, error)
      }
    }

    // 3. Delete old completed reminders (older than 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    await Reminder.query()
      .where('isCompleted', true)
      .where('reminderDateTime', '<', thirtyDaysAgo)
      .delete()

    this.logger.info('Notification job completed')
  }
}
