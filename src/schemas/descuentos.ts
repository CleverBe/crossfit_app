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

export const updateDescuentoSchemaClient = z.object({
  ...createDescuentoSchemaClient.shape,
})

export const updateDescuentoSchemaServer = z.object({
  ...createDescuentoSchemaServer.shape,
})

export type UpdateDescuentoInput = z.input<typeof updateDescuentoSchemaClient>
