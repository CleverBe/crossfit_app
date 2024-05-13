import { z } from "zod"

export const periodoSearchParamsSchema = z.object({
  periodo: z.string().regex(/^(?:20\d{2})-(?:0[1-9]|1[0-2])$/),
})

const createPeriodoSchema = z.object({
  periodo: z
    .string()
    .regex(
      /^(?:20\d{2})-(?:0[1-9]|1[0-2])$/,
      "Formato de fecha incorrecto, ejemplo: 2020-01",
    ),
})

export const createPeriodoSchemaClient = z.object({
  ...createPeriodoSchema.shape,
  instructor: z.preprocess((value) => {
    return value === "unassigned" ? undefined : value
  }, z.string().uuid().optional()),
})

export const createPeriodoSchemaServer = z.object({
  ...createPeriodoSchema.shape,
  instructor: z.string().uuid().optional(),
})

export type CreatePeriodoInput = z.infer<typeof createPeriodoSchemaClient>

export const assignInstructorToPeriodoSchema = z.object({
  instructorId: z.string(),
})

export type AssignInstructorToPeriodoSchemaInput = z.infer<
  typeof assignInstructorToPeriodoSchema
>
