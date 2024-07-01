import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Debe ser un correo valido").toLowerCase(),
  password: z.string(),
})

export type LoginInput = z.infer<typeof loginSchema>
