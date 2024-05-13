import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerUserSchemaClient = z
  .object({
    ...loginSchema.shape,
    name: z.string().min(4),
    matchPwd: z.string().min(4),
  })
  .refine((data) => data.password === data.matchPwd, {
    path: ["matchPwd"],
    message: "Passwords do not match",
  })

export type RegisterUserInputClient = z.infer<typeof registerUserSchemaClient>

export const registerUserSchemaServer = z.object({
  ...loginSchema.shape,
  name: z.string().min(4),
})

export type RegisterUserInputServer = z.infer<typeof registerUserSchemaServer>
