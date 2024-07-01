import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constants"
import { z } from "zod"

export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
}

export const getUserSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  email: z.string(),
  role: z.nativeEnum(Role),
  imagen: z.string().nullable().optional(),
})

export type UserFromApi = z.infer<typeof getUserSchema>

const createUserSchema = z.object({
  nombre: z.string().min(4, "Debe tener al menos 4 caracteres"),
  email: z.string().email("Debe ser un correo valido").toLowerCase(),
  password: z.string().min(4, "Debe tener al menos 4 caracteres"),
  role: z.nativeEnum(Role),
})

export const createUserSchemaClient = z.object({
  ...createUserSchema.shape,
  imagen: z
    .any() // al cargar la página el esquema se carga en el server y no reconoce FileList
    .superRefine((files, ctx) => {
      // una vez cargada ya puede reconocer FileList
      if (files instanceof FileList === false) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Valor invalido",
        })
      }
      if (files?.length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Solo puede subir un archivo",
        })
      }
      if (files?.length === 1) {
        if (files?.[0]?.size > MAX_FILE_SIZE) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "El archivo no debe superar los 2MB",
          })
        }
        if (!ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Solo se aceptan .jpg, .jpeg, .png y .webp",
          })
        }
      }
    })
    .optional(),
})

export const createUserSchemaServer = z.object({
  ...createUserSchema.shape,
  imagen: z
    .instanceof(File, { message: "Debe ser un archivo" })
    .refine((image) => image.size < MAX_FILE_SIZE, {
      message: "El archivo no debe superar los 2MB",
    })
    .refine((image) => ACCEPTED_IMAGE_TYPES.includes(image.type), {
      message: "Solo se aceptan .jpg, .jpeg, .png y .webp",
    })
    .optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchemaClient>

export const updateUserSchemaClient = z.object({
  ...createUserSchemaClient.shape,
  password: z.preprocess((password) => {
    return password === "" ? undefined : password
  }, z.string().min(4, "Debe tener al menos 4 caracteres").optional()),
})

export type UpdateUserInput = z.infer<typeof updateUserSchemaClient>

export const updateUserSchemaServer = z
  .object({
    ...createUserSchemaServer.shape,
  })
  .partial()

const createUserSchemaWithoutPassword = createUserSchemaServer.omit({
  password: true,
})

const updateUserWithoutPasswordSchema = z.object({
  ...createUserSchemaWithoutPassword.shape,
  imagen: z.string().optional(),
})

export const validateUserForJwtSchema = z.object({
  ...updateUserWithoutPasswordSchema.shape,
})
