import { PlanEstado, TipoDePago } from "@prisma/client"
import { z } from "zod"
import { getTipoDePlanSchema } from "./tipoDePlanes"
import { getDescuentoSchema } from "./descuentos"
import { checkTwoDates } from "@/utils"

export const getPlanSchema = z.object({
  id: z.string(),
  fecha_inscripcion: z.string(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  peso_cliente: z.string().nullable(),
  estatura_cliente: z.string().nullable(),
  estado: z.nativeEnum(PlanEstado),
  tipoDePlan: getTipoDePlanSchema,
  descuento: getDescuentoSchema.nullable(),
  pago: z.object({
    id: z.string(),
    tipo_de_pago: z.nativeEnum(TipoDePago),
    fecha_de_pago: z.string(),
    monto: z.string(),
  }),
})

export type PlanFromApi = z.infer<typeof getPlanSchema>

const updatePlanSchema = z.object({
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

export const updatePlanSchemaClient = z
  .object({
    ...updatePlanSchema.shape,
    fecha_inicio: z.string().date("Este campo es requerido"),
    fecha_fin: z.string().date("Este campo es requerido"),
    tipoDePlanId: z
      .string({ invalid_type_error: "Value must be a string" })
      .uuid("Seleccione un tipo de plan"),
    descuentoId: z
      .union([z.string().uuid(), z.literal("unassigned")])
      .transform((value) => (value === "unassigned" ? undefined : value))
      .optional(),
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

export type UpdatePlanSchemaInput = z.input<typeof updatePlanSchemaClient>
export type UpdatePlanSchemaOutput = z.output<typeof updatePlanSchemaClient>

export const updatePlanSchemaServer = z
  .object({
    ...updatePlanSchema.shape,
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
