import vine from '@vinejs/vine'

const name = vine.string().trim().minLength(1).maxLength(255)
const email = vine.string().trim().email().maxLength(254)
const phoneNumber = vine.string().trim().minLength(8).maxLength(32)

export const createUserValidator = vine.compile(
  vine.object({
    name: name,
    email: email.unique(async (db, value) => {
      const user = await db.from('users').where('email', value).first()
      return !user
    }),
    phoneNumber: phoneNumber,
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    name: name.optional(),
    email: email
      .unique(async (db, value, field) => {
        const user = await db
          .from('users')
          .whereNot('id', field.meta.userId)
          .where('email', value)
          .first()
        return !user
      })
      .optional(),
    phoneNumber: phoneNumber.optional(),
  })
)

export const userFilterValidator = vine.compile(
  vine.object({
    query: vine.string().optional(),
    sortBy: vine.enum(['name', 'email']).optional(),
    order: vine.enum(['asc', 'desc']).optional(),
  })
)

export const validateMasterKey = vine.compile(
  vine.object({
    headers: vine.object({
      'x-api-key': vine.string(),
    }),
  })
)
