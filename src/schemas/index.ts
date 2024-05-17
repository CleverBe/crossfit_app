import { z } from "zod"

export const numberlike = z.union([z.string(), z.number()], {
  errorMap: () => ({ message: "Must be a string or number" }),
})
