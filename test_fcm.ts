import { GoogleAuth } from 'google-auth-library'
import { resolve } from 'node:path'

async function test() {
  try {
    const serviceAccountPath = resolve('./firebase-service-account.json')
    const auth = new GoogleAuth({
      keyFile: serviceAccountPath,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    })
    const client = await auth.getClient()
    const token = await client.getAccessToken()
    console.log('Token object:', token)
  } catch (error) {
    console.error('Error:', error)
  }
}
test()
