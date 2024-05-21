import { z } from "zod"

const createAsistenciaSchema = z.object({
  codigo: z.string().min(6).max(7),
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
