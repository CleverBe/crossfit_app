import { Dias } from "@prisma/client"
import { z } from "zod"

export const getTipoDePlanSchema = z.object({
  id: z.string(),
  tipo: z.string().min(4),
  dias: z.array(z.nativeEnum(Dias)),
  costo: z.coerce.number().positive(),
  cantidadDeClases: z.number().int().positive(),
})

export type TipoDePlanFromApi = z.infer<typeof getTipoDePlanSchema>

export const getTiposDePlanesSchema = z.array(getTipoDePlanSchema)

export const formattedTipoDePlan = z.object({
  ...getTipoDePlanSchema.shape,
  dias: z.array(
    z.object({ label: z.nativeEnum(Dias), value: z.nativeEnum(Dias) }),
  ),
})

export type FormattedTipoDePlan = z.infer<typeof formattedTipoDePlan>

const createTipoDePlanSchema = z.object({
  tipo: z.string().min(4, "Debe tener al menos 4 caracteres"),
  costo: z
    .union([z.string(), z.number()])
    .pipe(z.coerce.number().positive("Valor invalido")),
  cantidadDeClases: z
    .union([z.string(), z.number()])
    .pipe(z.coerce.number().int().positive("Valor invalido")),
})

export const createTipoDePlanSchemaClient = z.object({
  ...createTipoDePlanSchema.shape,
  dias: z
    .array(z.object({ label: z.string(), value: z.nativeEnum(Dias) }))
    .min(1, "Debe seleccionar al menos 1 dia"),
})

export type CreateTipoDePlanInputClient = z.input<
  typeof createTipoDePlanSchemaClient
>

export const createTipoDePlanSchemaServer = z.object({
  ...createTipoDePlanSchema.shape,
  dias: z.array(z.nativeEnum(Dias)).min(1),
})

export type CreateTipoDePlanInputServer = z.input<
  typeof createTipoDePlanSchemaServer
>

export const updateTipoDePlanSchemaClient = z.object({
  ...createTipoDePlanSchemaClient.shape,
})

export const updateTipoDePlanSchemaServer = z.object({
  ...createTipoDePlanSchemaServer.shape,
})

export type UpdateTipoDePlanInput = z.infer<typeof updateTipoDePlanSchemaClient>
