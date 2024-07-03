import { axiosInstance } from "@/lib/axios"
import {
  UpdatePlanSchemaOutput,
  getPlanSchema,
  getPlansSchema,
} from "@/schemas/plan"

export const getHorarioPlansFn = async ({
  horarioId,
}: {
  horarioId: string
}) => {
  const response = await axiosInstance.get(`api/planes/horario/${horarioId}`)

  const validatedData = getPlansSchema.parse(response.data)

  return validatedData
}

export const getPlanFn = async (id: string) => {
  const response = await axiosInstance.get(`api/planes/${id}`)

  const validatedData = getPlanSchema.parse(response.data)

  return validatedData
}

export const updatePlanFn = async (
  data: UpdatePlanSchemaOutput & { id: string },
) => {
  const { id, ...body } = data

  const response = await axiosInstance.put(`api/planes/${id}`, body)

  return response.data
}

export const deletePlanFn = async (id: string) => {
  const response = await axiosInstance.delete(`api/planes/${id}`)

  return response.data
}
