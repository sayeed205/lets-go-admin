import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import DeviceToken from '#models/device_token'

export default class DeviceTokensController {
  /**
   * Register or update device FCM token
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { fcmToken, deviceId, deviceName, platform } = request.only([
      'fcmToken',
      'deviceId',
      'deviceName',
      'platform',
    ])

    const deviceToken = await DeviceToken.updateOrCreate(
      { userId: user.id, deviceId },
      {
        fcmToken,
        deviceName,
        platform,
        lastUsedAt: DateTime.now(),
      }
    )

    return response.ok({
      message: 'Device token registered successfully',
      data: deviceToken,
    })
  }

  /**
   * Get all devices for the authenticated user
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const devices = await DeviceToken.query().where('userId', user.id)

    return response.ok({
      message: 'Device tokens list',
      data: devices,
    })
  }

  /**
   * Remove a device token (logout from specific device)
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const deviceToken = await DeviceToken.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    await deviceToken.delete()

    return response.ok({
      message: 'Device token removed successfully',
    })
  }
}
