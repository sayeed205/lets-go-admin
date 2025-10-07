import vine from '@vinejs/vine'
import { UserRoleEnum } from '#enums/user'

export const loginBody = vine.object({
  email: vine.string().email(),
  password: vine.string().minLength(8).maxLength(32),
})

export const loginResponse = vine.object({
  message: vine.string(),
  data: vine.object({
    type: vine.string(),
    name: vine.string().nullable(),
    token: vine.string().startsWith('oat_'),
    abilities: vine.array(vine.string()),
    lastUsedAt: vine.string().nullable(),
    expiresAt: vine.string(),
  }),
})

export const getMeResponse = vine.object({
  message: vine.string(),
  data: vine.object({
    id: vine.string().maxLength(25),
    name: vine.string().maxLength(255),
    email: vine.string().maxLength(254),
    phoneNumber: vine.string().maxLength(255),
    role: vine.enum(UserRoleEnum),
    createdAt: vine.string(),
    updatedAt: vine.string(),
    isVerified: vine.boolean(),
  }),
})
