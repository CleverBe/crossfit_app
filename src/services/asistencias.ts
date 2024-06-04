import { axiosInstance } from "@/lib/axios"
import {
  CreateAsistenciaInputClient,
  getAsistenciaSchema,
} from "@/schemas/asistencias"

export const getAsistenciasFn = async ({ planId }: { planId: string }) => {
  const response = await axiosInstance.get(`api/asistencias?planId=${planId}`)

  const validatedData = getAsistenciaSchema.array().parse(response.data)

  return validatedData
}

export const createAsistenciaFn = async (data: CreateAsistenciaInputClient) => {
  const response = await axiosInstance.post(`api/asistencias`, data)

  return response.data
}

export const deleteAsistenciaFn = async (id: string) => {
  const response = await axiosInstance.delete(`api/asistencias/${id}`)

  return response.data
}
