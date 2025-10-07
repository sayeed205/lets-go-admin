import vine from '@vinejs/vine'

import { loginBody } from '#dtos/auth_dto'

export const loginValidator = vine.compile(loginBody)
