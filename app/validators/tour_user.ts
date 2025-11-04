import vine from '@vinejs/vine'

export const createTourUserValidator = vine.compile(
  vine.object({
    tourId: vine.string().trim(),
    userId: vine.string().trim(),
    totalCost: vine.number().min(0),
    adultCount: vine.number().min(0),
    adultCost: vine.number().min(0),
    adultGst: vine.number().min(0).max(100),
    childCount: vine.number().min(0).optional(),
    childCost: vine.number().min(0).optional(),
    childGst: vine.number().min(0).max(100).optional(),
    recievedAmount: vine.number().min(0).optional(),
  })
)

export const updateTourUserValidator = vine.compile(
  vine.object({
    totalCost: vine.number().min(0).optional(),
    adultCount: vine.number().min(0).optional(),
    adultCost: vine.number().min(0).optional(),
    adultGst: vine.number().min(0).max(100).optional(),
    childCount: vine.number().min(0).optional(),
    childCost: vine.number().min(0).optional(),
    childGst: vine.number().min(0).max(100).optional(),
    recievedAmount: vine.number().min(0).optional(),
  })
)
