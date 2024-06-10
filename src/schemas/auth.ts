import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Debe ser un correo valido"),
  password: z.string(),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerUserSchemaClient = z
  .object({
    name: z.string().min(4, "Debe tener al menos 4 caracteres"),
    email: z.string().email("Debe ser un correo valido"),
    password: z.string().min(4, "Debe tener al menos 4 caracteres"),
    matchPwd: z.string().min(4),
  })
  .refine((data) => data.password === data.matchPwd, {
    path: ["matchPwd"],
    message: "Las contraseñas no coinciden",
  })

export type RegisterUserInputClient = z.infer<typeof registerUserSchemaClient>

export const registerUserSchemaServer = z.object({
  name: z.string().min(4, "Debe tener al menos 4 caracteres"),
  email: z.string().email("Debe ser un correo valido"),
  password: z.string().min(4, "Debe tener al menos 4 caracteres"),
})

export type RegisterUserInputServer = z.infer<typeof registerUserSchemaServer>
