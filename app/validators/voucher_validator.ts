import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

const bookingId = vine.string().trim().minLength(1).optional()
const date = vine.date().transform((d) => DateTime.fromJSDate(d))
const subBookingType = vine.string().trim().minLength(1).optional()
const propertyName = vine.string().trim().minLength(1).optional()
const address = vine.string().trim().minLength(1).optional()
const checkinDate = vine
  .date()
  .transform((d) => DateTime.fromJSDate(d))
  .optional()
const checkoutDate = vine
  .date()
  .transform((d) => DateTime.fromJSDate(d))
  .optional()
const serviceType = vine.string().trim().minLength(1).optional()
const meal = vine.string().trim().minLength(1).optional()
const payment = vine.string().trim().minLength(1).optional()
const confirmedBy = vine.string().trim().minLength(1).optional()
const serviceContact = vine.string().trim().minLength(1).optional()
const confirmerContact = vine.string().trim().minLength(1).optional()

export const createVoucherValidator = vine.compile(
  vine.object({
    tourUserId: vine.string().trim().minLength(1),
    bookingId,
    date,
    subBookingType,
    propertyName,
    address,
    checkinDate,
    checkoutDate,
    serviceType,
    meal,
    payment,
    confirmedBy,
    serviceContact,
    confirmerContact,
  })
)

export const updateVoucherValidator = vine.compile(
  vine.object({
    bookingId,
    date,
    subBookingType,
    propertyName,
    address,
    checkinDate,
    checkoutDate,
    serviceType,
    meal,
    payment,
    confirmedBy,
    serviceContact,
    confirmerContact,
  })
)
