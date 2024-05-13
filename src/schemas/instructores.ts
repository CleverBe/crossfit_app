import { Genero } from "@prisma/client"
import { z } from "zod"

export const getInstructorSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  apellido: z.string(),
  email: z.string(),
  genero: z.nativeEnum(Genero),
  celular: z.string(),
})

export type InstructorFromApi = z.infer<typeof getInstructorSchema>

export const getInstructoresSchema = z.array(getInstructorSchema)

export type InstructoresFromApi = z.infer<typeof getInstructoresSchema>

const createInstructorSchema = z.object({
  nombre: z.string().min(4),
  apellido: z.string().min(4),
  email: z.string().email(),
  genero: z.nativeEnum(Genero),
  celular: z.string(),
})

export const createInstructorSchemaClient = z.object({
  ...createInstructorSchema.shape,
})

export const createInstructorSchemaServer = z.object({
  ...createInstructorSchema.shape,
})

export type CreateInstructorInput = z.infer<typeof createInstructorSchemaClient>

export const updateInstructorSchemaClient = z.object({
  ...createInstructorSchemaClient.shape,
})

export type UpdateInstructorInput = z.infer<typeof updateInstructorSchemaClient>

export const updateInstructorSchemaServer = z
  .object({
    ...createInstructorSchema.shape,
  })
  .partial()
