import vine from '@vinejs/vine'

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
