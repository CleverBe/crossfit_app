import { axiosInstance } from "@/lib/axios"
import {
  CreateHorarioInput,
  UpdateHorarioInput,
  getHorarioSchema,
} from "@/schemas/horarios"

export const getHorariosFn = async () => {
  const response = await axiosInstance.get(`api/horarios`)

  const validatedData = getHorarioSchema.array().parse(response.data)

  return validatedData
}

export const getHorarioFn = async (id: string) => {
  const response = await axiosInstance.get(`api/horarios/${id}`)

  const validatedData = getHorarioSchema.parse(response.data)

  return validatedData
}

export const createHorarioFn = async (data: CreateHorarioInput) => {
  const response = await axiosInstance.post(`api/horarios`, data)

  return response.data
}

export const updateHorarioFn = async (
  data: UpdateHorarioInput & { id: string },
) => {
  const { id, ...rest } = data

  const response = await axiosInstance.patch(`api/horarios/${id}`, rest)

  return response.data
}

export const deleteHorarioFn = async (id: string) => {
  const response = await axiosInstance.delete(`api/horarios/${id}`)

  return response.data
}
