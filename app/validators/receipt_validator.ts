import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

const tourUserId = vine.string().trim().minLength(1).maxLength(25)
const date = vine.date().transform((d) => DateTime.fromJSDate(d))
const amount = vine.number().min(1)
const method = vine.string().trim().minLength(1).maxLength(255)
const methodInfo = vine.string().trim().maxLength(255).optional()

export const createReceiptValidator = vine.compile(
  vine.object({
    tourUserId,
    date,
    amount,
    method,
    methodInfo,
  })
)

export const updateReceiptValidator = vine.compile(
  vine.object({
    date: date.optional(),
    amount: amount.optional(),
    method: method.optional(),
    methodInfo,
  })
)
