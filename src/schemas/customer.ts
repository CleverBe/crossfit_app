import { checkTwoDates } from "@/utils"
import { Genero, TipoDePago } from "@prisma/client"
import { z } from "zod"

export const getCustomerSchema = z.object({
  id: z.string(),
  nombre_completo: z.string(),
  genero: z.nativeEnum(Genero),
  celular: z.string(),
  cedula: z.string().min(6).max(7),
  fecha_nacimiento: z.string().date(),
  peso: z.string().nullable(),
  estatura: z.string().nullable(),
})

export type CustomerFromApi = z.infer<typeof getCustomerSchema>

const createCustomerSchema = z.object({
  nombre_completo: z.string().min(3),
  genero: z.nativeEnum(Genero),
  celular: z.string().min(7),
  cedula: z.string().min(6).max(7),
  peso_cliente: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      const valNum = z.coerce
        .number()
        .positive({ message: "Value must be positive" })
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

      const valNum = z.coerce
        .number()
        .positive({ message: "Value must be positive" })
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
    fecha_nacimiento: z.string().date("Este campo es requerido"),
    fecha_inicio: z.string().date("Este campo es requerido"),
    fecha_fin: z.string().date("Este campo es requerido"),
    tipoDePlanId: z
      .string({ invalid_type_error: "Value must be a string" })
      .uuid("Seleccione un tipo de plan"),
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
      message: "La fecha de inicio no puede ser posterior a la fecha de fin",
      path: ["fecha_inicio"],
    },
  )

export type CreateCustomerInput = z.input<typeof createCustomerSchemaClient>
export type CreateCustomerOutput = z.output<typeof createCustomerSchemaClient>

export const createCustomerSchemaServer = z
  .object({
    ...createCustomerSchema.shape,
    fecha_nacimiento: z
      .string()
      .date("Formato de fecha incorrecto. Ejemplo: 2000-01-01"),
    fecha_inicio: z
      .string()
      .date("Formato de fecha incorrecto. Ejemplo: 2000-01-01"),
    fecha_fin: z
      .string()
      .date("Formato de fecha incorrecto. Ejemplo: 2000-01-01"),
    tipoDePlanId: z.string().uuid(),
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
      message: "La fecha de inicio no puede ser posterior a la fecha de fin",
      path: ["fecha_inicio"],
    },
  )

const updateCustomerSchema = z
  .object({
    nombre_completo: z.string().min(3),
    genero: z.nativeEnum(Genero),
    celular: z.string().min(7),
    cedula: z.string().min(6).max(7),
    peso_cliente: z
      .string()
      .optional()
      .refine((val) => {
        if (val === "" || val === undefined) return true

        const valNum = z.coerce
          .number()
          .positive({ message: "Value must be positive" })
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

        const valNum = z.coerce
          .number()
          .positive({ message: "Value must be positive" })
        const validationNum = valNum.safeParse(val)

        if (!validationNum.success) {
          return false
        }

        return true
      })
      .transform((val) => (val === "" ? undefined : val)),
  })
  .partial()

export const updateCustomerSchemaClient = z.object({
  ...updateCustomerSchema.shape,
  fecha_nacimiento: z.string().date("Este campo es requerido."),
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
    .date("Formato de fecha incorrecto. Ejemplo: 2000-01-01"),
})
