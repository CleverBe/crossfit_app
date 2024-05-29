import { Estado } from "@prisma/client"
import { z } from "zod"

export const getDescuentoSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  porcentaje: z.coerce.number().nonnegative(),
  estado: z.nativeEnum(Estado),
})

export type DescuentoFromApi = z.infer<typeof getDescuentoSchema>

export const getDescuentosSchema = z.array(getDescuentoSchema)

const createDescuentoSchema = z.object({
  titulo: z.string().min(4),
  porcentaje: z
    .union([z.string(), z.number()])
    .pipe(z.coerce.number().positive().min(1).max(100)),
})

export const createDescuentoSchemaClient = z.object({
  ...createDescuentoSchema.shape,
})

export type CreateDescuentoInputClient = z.input<
  typeof createDescuentoSchemaClient
>

export const createDescuentoSchemaServer = z.object({
  ...createDescuentoSchema.shape,
})

const updateDescuentoSchema = z.object({
  ...createDescuentoSchema.shape,
  estado: z.nativeEnum(Estado),
})

export const updateDescuentoSchemaClient = z.object({
  ...updateDescuentoSchema.shape,
})

export type UpdateDescuentoInput = z.input<typeof updateDescuentoSchemaClient>

export const updateDescuentoSchemaServer = z
  .object({
    ...updateDescuentoSchema.shape,
  })
  .partial()

export const getDescuentosSearchParamsSchema = z
  .object({
    estado: z.nativeEnum(Estado),
  })
  .partial()
