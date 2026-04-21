import DeviceToken from '#models/device_token'
import logger from '@adonisjs/core/services/logger'
import { GoogleAuth } from 'google-auth-library'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import env from '#start/env'

interface NotificationPayload {
  title: string
  body: string
  data?: Record<string, string>
}

export default class FcmService {
  private projectId: string
  private auth: GoogleAuth

  constructor() {
    this.projectId = env.get('FCM_PROJECT_ID', '')
    const serviceAccountPath = resolve(
      env.get('FCM_SERVICE_ACCOUNT_PATH', './firebase-service-account.json')
    )

    try {
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
      this.auth = new GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
      })
    } catch (error) {
      logger.error('Failed to load Firebase service account: ' + (error as Error).message, {
        error,
        serviceAccountPath,
      })
      this.auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
      })
    }
  }

  /**
   * Get OAuth2 access token for FCM v1 API
   */
  private async getAccessToken(): Promise<string> {
    const client = await this.auth.getClient()
    const tokenResponse = await client.getAccessToken()
    return tokenResponse.token || ''
  }

  /**
   * Send notification to a single device using FCM v1 API
   */
  async sendToDevice(fcmToken: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${this.projectId}/messages:send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            message: {
              token: fcmToken,
              notification: {
                title: payload.title,
                body: payload.body,
              },
              data: payload.data || {},
              android: {
                priority: 'high' as const,
                notification: {
                  sound: 'default',
                  channelId: 'reminder_notifications',
                },
              },
            },
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        logger.error(`FCM v1 send failed (status ${response.status}): ` + JSON.stringify(result), {
          fcmToken,
        })
        return false
      }

      return true
    } catch (error) {
      logger.error('FCM v1 send error: ' + (error as Error).message, {
        fcmToken,
        projectId: this.projectId,
        error: (error as Error).name,
        stack: (error as Error).stack,
      })
      return false
    }
  }

  /**
   * Send notification to all devices of a user
   */
  async sendToUser(userId: string, payload: NotificationPayload): Promise<void> {
    const devices = await DeviceToken.query().where('userId', userId)

    const promises = devices.map(async (device) => {
      const success = await this.sendToDevice(device.fcmToken, payload)

      // Remove invalid tokens (UNREGISTERED or INVALID_ARGUMENT)
      if (!success) {
        await device.delete()
      }
    })

    await Promise.all(promises)
  }

  /**
   * Send notification to multiple users
   */
  async sendToUsers(userIds: string[], payload: NotificationPayload): Promise<void> {
    const promises = userIds.map((userId) => this.sendToUser(userId, payload))
    await Promise.all(promises)
  }
}
