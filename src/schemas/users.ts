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
  nombre: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
    .min(4, "Username must be at least 4 characters long"),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Email must be a valid email"),
  password: z
    .string({
      required_error: "password is required",
      invalid_type_error: "password must be a string",
    })
    .min(4, "Password must be at least 4 characters long"),
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
          message: "Invalid value",
        })
      }
      if (files?.length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "You can select only one file",
        })
      }
      if (files?.length === 1) {
        if (files?.[0]?.size > MAX_FILE_SIZE) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Max file size is 2MB.",
          })
        }
        if (!ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: ".jpg, .jpeg, .png and .webp files are accepted.",
          })
        }
      }
    })
    .optional(),
})

export const createUserSchemaServer = z.object({
  ...createUserSchema.shape,
  imagen: z
    .instanceof(File, { message: "Image must be an instance of File" })
    .refine((image) => image.size < MAX_FILE_SIZE, {
      message: "Max file size is 2MB.",
    })
    .refine((image) => ACCEPTED_IMAGE_TYPES.includes(image.type), {
      message: ".jpg, .jpeg, .png and .webp files are accepted.",
    })
    .optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchemaClient>

export const updateUserSchemaClient = z.object({
  ...createUserSchemaClient.shape,
  password: z.preprocess(
    (password) => {
      return password === "" ? undefined : password
    },
    z
      .string({
        required_error: "password is required",
        invalid_type_error: "password must be a string",
      })
      .min(4, "Password must be at least 4 characters long")
      .optional(),
  ),
})

export type UpdateUserInput = z.infer<typeof updateUserSchemaClient>

export const updateUserSchemaServer = z
  .object({
    ...createUserSchemaServer.shape,
  })
  .partial()
