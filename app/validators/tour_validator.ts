import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

const name = vine.string().trim().minLength(1).maxLength(255)
const description = vine.string().optional()
const startDate = vine.date({ formats: ['YYYY/DD/MM'] }).transform((d) => DateTime.fromJSDate(d))
const endDate = vine.date({ formats: ['YYYY/DD/MM'] }).transform((d) => DateTime.fromJSDate(d))
export const createTourValidator = vine.compile(
  vine.object({
    name: name,
    description,
    startDate,
    endDate,
  })
)

export const updateTourValidator = vine.compile(
  vine.object({
    name: name.optional(),
    description,
    startDate,
    endDate,
  })
)

const adultCount = vine.number().min(1).max(255)
const adultCost = vine.number().min(1)
const adultGst = vine.number().min(1).max(100).optional()
const childCount = vine.number().min(0).max(255).optional()
const childCost = vine.number().min(0).optional()
const childGst = vine.number().min(1).max(100).optional()
const discountAmount = vine.number().min(0).optional()

export const createTourUserValidator = vine.compile(
  vine.object({
    tourId: vine.string().trim().minLength(1).maxLength(25),
    userId: vine.string().trim().minLength(1).maxLength(25),
    adultCount,
    adultCost,
    adultGst,
    childCount,
    childCost,
    childGst,
    discountAmount,
  })
)

export const updateTourUserValidator = vine.compile(
  vine.object({
    adultCount: adultCount.optional(),
    adultCost: adultCost.optional(),
    adultGst,
    childCount,
    childCost,
    childGst,
    discountAmount,
  })
)

export const tourFilterValidator = vine.compile(
  vine.object({
    query: vine.string().optional(),
    sortBy: vine
      .enum(['start', 'end'])
      .optional()
      .transform((val) => (val ? val : 'start')),
    order: vine
      .enum(['asc', 'desc'])
      .optional()
      .transform((val) => (val ? val : 'asc')),
    start: vine.date({ formats: ['YYYY/MM/DD'] }).optional(),
    // .transform((v) => (v ? DateTime.fromJSDate(v) : undefined)),
    end: vine.date({ formats: ['YYYY/MM/DD'] }).optional(),
    // .transform((v) => (v ? DateTime.fromJSDate(v) : undefined)),
  })
)
