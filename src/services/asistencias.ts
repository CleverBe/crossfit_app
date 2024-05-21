import { axiosInstance } from "@/lib/axios"
import { CreateAsistenciaInputClient } from "@/schemas/asistencias"

export const createAsistenciaFn = async (data: CreateAsistenciaInputClient) => {
  const response = await axiosInstance.post(`api/asistencias`, data)

  return response.data
}
