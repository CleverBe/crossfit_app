import { z } from "zod"

export const isPositiveNumber = (val: string) => {
  const valNum = z.coerce.number().positive()

  const validationNum = valNum.safeParse(val)

  if (!validationNum.success) {
    return false
  }

  return true
}

export const isValidHour = (val: string) => {
  const valNum = z.coerce.number().positive()

  const validationNum = valNum.safeParse(val)

  if (!validationNum.success) {
    return false
  }

  const valRegex = z.string().regex(/^([0-5]?[0-9])$/, "Formato incorrecto")

  const validationRegex = valRegex.safeParse(val)

  if (!validationRegex.success) {
    return false
  }

  return true
}

export function formatTimeAddZero(time: string) {
  const formattedMinutes = time.padStart(2, "0")

  return formattedMinutes
}
