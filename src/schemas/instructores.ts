import { Estado, Genero } from "@prisma/client"
import { z } from "zod"

export const getInstructorSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  apellido: z.string(),
  email: z.string(),
  genero: z.nativeEnum(Genero),
  celular: z.string(),
  estado: z.nativeEnum(Estado),
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

const updateInstructorSchema = z.object({
  ...createInstructorSchemaClient.shape,
  estado: z.nativeEnum(Estado),
})

export const updateInstructorSchemaClient = z.object({
  ...updateInstructorSchema.shape,
})

export type UpdateInstructorInput = z.input<typeof updateInstructorSchemaClient>
export type UpdateInstructorOutput = z.output<
  typeof updateInstructorSchemaClient
>

export const updateInstructorSchemaServer = z
  .object({
    ...updateInstructorSchema.shape,
  })
  .partial()

export const getInstructoresSearchParamsSchema = z
  .object({
    estado: z.nativeEnum(Estado),
  })
  .partial()
