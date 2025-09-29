import vine from '@vinejs/vine'

export const loginBody = vine.object({
  email: vine.string().email(),
  password: vine.string().minLength(8).maxLength(32),
})

export const loginValidator = vine.compile(loginBody)
