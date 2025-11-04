import vine from '@vinejs/vine'

const name = vine.string().trim().minLength(1).maxLength(255)

export const createTourValidator = vine.compile(
  vine.object({
    name: name,
  })
)

export const updateTourValidator = vine.compile(
  vine.object({
    name: name.optional(),
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
