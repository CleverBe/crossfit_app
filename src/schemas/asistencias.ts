import { z } from "zod"

export const getAsistenciaSchema = z.object({
  id: z.string(),
  fecha: z.string().datetime(),
})

export type AsistenciaFromApi = z.infer<typeof getAsistenciaSchema>

const createAsistenciaSchema = z.object({
  codigo: z.string(),
})

export const createAsistenciaSchemaClient = z.object({
  ...createAsistenciaSchema.shape,
})

export type CreateAsistenciaInputClient = z.infer<
  typeof createAsistenciaSchemaClient
>

export const createAsistenciaSchemaServer = z.object({
  ...createAsistenciaSchema.shape,
})

export type CreateAsistenciaInputServer = z.infer<
  typeof createAsistenciaSchemaServer
>
