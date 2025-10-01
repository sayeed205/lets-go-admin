import vine from '@vinejs/vine'

export const messageBody = vine.object({
  message: vine.string(),
  data: vine.any().nullable(),
})
