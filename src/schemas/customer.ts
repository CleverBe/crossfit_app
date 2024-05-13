import { Genero, TipoDePago } from "@prisma/client"
import { z } from "zod"

const createCustomerSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  genero: z.nativeEnum(Genero),
  celular: z.string(),
  fecha_nacimiento: z
    .string()
    .date("Formato de fecha incorrecto, ejemplo: 2000-01-01"),
  fecha_inicio: z
    .string()
    .date("Formato de fecha incorrecto, ejemplo: 2000-01-01"),
  fecha_fin: z
    .string()
    .date("Formato de fecha incorrecto, ejemplo: 2000-01-01"),
  peso_cliente: z.number(),
  estatura: z.number(),
  tipoDePlanId: z.string().uuid(),
  tipoDePago: z.nativeEnum(TipoDePago),
})

export const createCustomerSchemaClient = z.object({
  ...createCustomerSchema.shape,
  descuentoId: z.preprocess((value) => {
    return value === "unassigned" ? undefined : value
  }, z.string().uuid().optional()),
})

export type CreateCustomerInput = z.infer<typeof createCustomerSchemaClient>

export const createCustomerSchemaServer = z.object({
  ...createCustomerSchema.shape,
  descuentoId: z.string().uuid().optional(),
})
