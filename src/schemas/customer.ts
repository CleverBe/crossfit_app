import { checkTwoDates } from "@/utils"
import { Genero, PlanEstado, TipoDePago } from "@prisma/client"
import { z } from "zod"
import { getAsistenciaSchema } from "./asistencias"

export const getCustomerSchema = z.object({
  id: z.string(),
  nombre_completo: z.string(),
  genero: z.nativeEnum(Genero),
  celular: z.string(),
  cedula: z.string().min(6).max(7),
  fecha_nacimiento: z.string().date().nullable(),
  peso: z.string().nullable(),
  estatura: z.string().nullable(),
})

export type CustomerFromApi = z.infer<typeof getCustomerSchema>

export const getCustomerPlansSchema = z.object({
  id: z.string(),
  nombre_completo: z.string(),
  genero: z.nativeEnum(Genero),
  celular: z.string(),
  cedula: z.string().min(6).max(7),
  fecha_nacimiento: z.string().date().nullable(),
  peso: z.string().nullish(),
  estatura: z.string().nullish(),
  planes: z.array(
    z.object({
      id: z.string(),
      fecha_inscripcion: z.string(),
      fecha_inicio: z.string(),
      fecha_fin: z.string(),
      peso_cliente: z.string().nullable(),
      estatura_cliente: z.string().nullable(),
      estado: z.nativeEnum(PlanEstado),
      asistencias: z.array(getAsistenciaSchema),
    }),
  ),
})

const createCustomerSchema = z.object({
  nombre_completo: z.string().min(6, "Debe tener al menos 6 caracteres"),
  genero: z.nativeEnum(Genero),
  celular: z.string().min(7, "Debe tener al menos 7 caracteres"),
  cedula: z
    .string()
    .min(6, "Debe tener entre 6 y 7 caracteres")
    .max(7, "Debe tener entre 6 y 7 caracteres"),
  peso_cliente: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      const valNum = z.coerce.number().positive({ message: "Valor invalido" })
      const validationNum = valNum.safeParse(val)

      if (!validationNum.success) {
        return false
      }

      return true
    })
    .transform((val) => (val === "" ? undefined : val)),
  estatura: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      const valNum = z.coerce.number().positive({ message: "Valor invalido" })
      const validationNum = valNum.safeParse(val)

      if (!validationNum.success) {
        return false
      }

      return true
    })
    .transform((val) => (val === "" ? undefined : val)),
  tipoDePago: z.nativeEnum(TipoDePago),
})

export const createCustomerSchemaClient = z
  .object({
    ...createCustomerSchema.shape,
    fecha_nacimiento: z
      .union([z.string().date(), z.literal("")])
      .transform((val) => (val === "" ? undefined : val)),
    fecha_inicio: z.string().date("Este campo es requerido"),
    fecha_fin: z.string().date("Este campo es requerido"),
    horarioId: z.string().uuid("Seleccione un horario"),
    tipoDePlanId: z.string().uuid("Seleccione un tipo de plan"),
    descuentoId: z
      .union([z.string().uuid(), z.literal("unassigned")])
      .transform((value) => (value === "unassigned" ? undefined : value)),
  })
  .refine(
    (values) => {
      if (values.fecha_inicio && values.fecha_fin) {
        const result = checkTwoDates({
          dateInicial: values.fecha_inicio,
          dateFinal: values.fecha_fin,
        })

        return result.result
      }
      return false
    },
    {
      message:
        "La fecha de finalización no puede ser inferior a la fecha de inicio",
      path: ["fecha_fin"],
    },
  )

export type CreateCustomerInput = z.input<typeof createCustomerSchemaClient>
export type CreateCustomerOutput = z.output<typeof createCustomerSchemaClient>

export const createCustomerSchemaServer = z
  .object({
    ...createCustomerSchema.shape,
    fecha_nacimiento: z
      .string()
      .date("Formato de fecha incorrecto. Ejemplo: 2000-01-01")
      .optional(),
    fecha_inicio: z
      .string()
      .date("Formato de fecha incorrecto. Ejemplo: 2000-01-01"),
    fecha_fin: z
      .string()
      .date("Formato de fecha incorrecto. Ejemplo: 2000-01-01"),
    tipoDePlanId: z.string().uuid(),
    horarioId: z.string().uuid(),
    descuentoId: z.string().uuid().optional(),
  })
  .refine(
    (values) => {
      if (values.fecha_inicio && values.fecha_fin) {
        const result = checkTwoDates({
          dateInicial: values.fecha_inicio,
          dateFinal: values.fecha_fin,
        })

        return result.result
      }
      return false
    },
    {
      message:
        "La fecha de finalización no puede ser inferior a la fecha de inicio",
      path: ["fecha_fin"],
    },
  )

const updateCustomerSchema = z
  .object({
    nombre_completo: z.string().min(3, "Debe tener al menos 3 caracteres"),
    genero: z.nativeEnum(Genero),
    celular: z.string().min(7, "Debe tener al menos 7 caracteres"),
    cedula: z
      .string()
      .min(6, "Debe tener entre 6 y 7 caracteres")
      .max(7, "Debe tener entre 6 y 7 caracteres"),
    peso_cliente: z
      .string()
      .optional()
      .refine((val) => {
        if (val === "" || val === undefined) return true

        const valNum = z.coerce.number().positive({ message: "Valor invalido" })
        const validationNum = valNum.safeParse(val)

        if (!validationNum.success) {
          return false
        }

        return true
      })
      .transform((val) => (val === "" ? undefined : val)),
    estatura: z
      .string()
      .optional()
      .refine((val) => {
        if (val === "" || val === undefined) return true

        const valNum = z.coerce.number().positive({ message: "Valor invalido" })
        const validationNum = valNum.safeParse(val)

        if (!validationNum.success) {
          return false
        }

        return true
      })
      .transform((val) => (val === "" ? undefined : val)),
    fecha_nacimiento: z
      .union([z.string().date(), z.literal("")])
      .transform((val) => (val === "" ? undefined : val)),
  })
  .partial()

export const updateCustomerSchemaClient = z.object({
  ...updateCustomerSchema.shape,
})

export type updateCustomerSchemaClientInput = z.input<
  typeof updateCustomerSchemaClient
>

export type updateCustomerSchemaClientOutput = z.output<
  typeof updateCustomerSchemaClient
>

export const updateCustomerSchemaServer = z.object({
  ...updateCustomerSchema.shape,
  fecha_nacimiento: z
    .string()
    .date("Formato de fecha incorrecto. Ejemplo: 2000-01-01")
    .optional(),
})
