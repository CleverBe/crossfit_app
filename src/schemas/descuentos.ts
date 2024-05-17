import { z } from "zod"

export const getDescuentoSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  porcentaje: z.coerce.number().nonnegative(),
})

export type DescuentoFromApi = z.infer<typeof getDescuentoSchema>

export const getDescuentosSchema = z.array(getDescuentoSchema)

const createDescuentoSchema = z.object({
  titulo: z.string().min(4),
  porcentaje: z.coerce.number().nonnegative(),
})

export const createDescuentoSchemaClient = z.object({
  ...createDescuentoSchema.shape,
})

export type CreateDescuentoInputClient = z.infer<
  typeof createDescuentoSchemaClient
>

export const createDescuentoSchemaServer = z.object({
  ...createDescuentoSchema.shape,
})

export const updateDescuentoSchemaClient = z.object({
  ...createDescuentoSchemaClient.shape,
})

export const updateDescuentoSchemaServer = z.object({
  ...createDescuentoSchemaServer.shape,
})

export type UpdateDescuentoInput = z.infer<typeof updateDescuentoSchemaClient>
