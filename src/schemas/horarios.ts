import { compareTimes } from "@/utils"
import { Estado, Turno } from "@prisma/client"
import { z } from "zod"

export const getHorarioSchema = z.object({
  id: z.string(),
  hora_inicio: z.string(),
  hora_fin: z.string(),
  turno: z.nativeEnum(Turno),
  estado: z.nativeEnum(Estado),
})

export type HorarioFromApi = z.infer<typeof getHorarioSchema>

const createHorarioSchema = z.object({
  hora_inicio: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora incorrecto"),
  hora_fin: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora incorrecto"),
})

export const createHorarioSchemaClient = z
  .object({
    ...createHorarioSchema.shape,
  })
  .refine(
    (values) => {
      return compareTimes(values.hora_inicio, values.hora_fin)
    },
    {
      path: ["hora_inicio"],
      message: "El horario inicial debe ser anterior al horario final",
    },
  )

export const createHorarioSchemaServer = z
  .object({
    ...createHorarioSchema.shape,
  })
  .refine(
    (values) => {
      return compareTimes(values.hora_inicio, values.hora_fin)
    },
    {
      path: ["hora_inicio"],
      message: "El horario inicial debe ser anterior al horario final",
    },
  )

export type CreateHorarioInput = z.infer<typeof createHorarioSchemaClient>

const updateHorarioSchema = z.object({
  ...createHorarioSchema.shape,
  estado: z.nativeEnum(Estado),
})

export const updateHorarioSchemaClient = z
  .object({
    ...updateHorarioSchema.shape,
  })
  .refine(
    (values) => {
      return compareTimes(values.hora_inicio, values.hora_fin)
    },
    {
      path: ["hora_inicio"],
      message: "El horario inicial debe ser anterior al horario final",
    },
  )

export type UpdateHorarioInput = z.infer<typeof updateHorarioSchemaClient>

export const updateHorarioSchemaServer = z
  .object({
    ...updateHorarioSchema.shape,
  })
  .partial()
  .refine(
    (values) => {
      if (values.hora_inicio && values.hora_fin) {
        return compareTimes(values.hora_inicio, values.hora_fin)
      }
      return true
    },
    {
      path: ["hora_inicio"],
      message: "El horario inicial debe ser anterior al horario final",
    },
  )
