import { Dias } from "@prisma/client"
import { z } from "zod"

export const getTipoDePlanSchema = z.object({
  id: z.string(),
  tipo: z.string().min(4),
  dias: z.array(z.nativeEnum(Dias)),
  costo: z.coerce.number().nonnegative(),
})

export type TipoDePlanFromApi = z.infer<typeof getTipoDePlanSchema>

export const formattedTipoDePlan = z.object({
  ...getTipoDePlanSchema.shape,
  dias: z.array(
    z.object({ label: z.nativeEnum(Dias), value: z.nativeEnum(Dias) }),
  ),
})

export type FormattedTipoDePlan = z.infer<typeof formattedTipoDePlan>

const createTipoDePlanSchema = z.object({
  tipo: z.string().min(4),
  costo: z.coerce.number().nonnegative(),
})

export const createTipoDePlanSchemaClient = z.object({
  ...createTipoDePlanSchema.shape,
  dias: z
    .array(z.object({ label: z.string(), value: z.nativeEnum(Dias) }))
    .min(1),
})

export type CreateTipoDePlanInputClient = z.infer<
  typeof createTipoDePlanSchemaClient
>

export const createTipoDePlanSchemaServer = z.object({
  ...createTipoDePlanSchema.shape,
  dias: z.array(z.nativeEnum(Dias)).min(1),
})

export const updateTipoDePlanSchemaClient = z.object({
  ...createTipoDePlanSchemaClient.shape,
})

export const updateTipoDePlanSchemaServer = z.object({
  ...createTipoDePlanSchemaServer.shape,
})

export type UpdateTipoDePlanInput = z.infer<typeof updateTipoDePlanSchemaClient>
