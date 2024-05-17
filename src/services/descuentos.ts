import { axiosInstance } from "@/lib/axios"
import {
  CreateDescuentoInputClient,
  UpdateDescuentoInput,
  getDescuentoSchema,
  getDescuentosSchema,
} from "@/schemas/descuentos"

export const getDescuentosFn = async () => {
  const response = await axiosInstance.get(`api/descuentos`)

  const validatedData = getDescuentosSchema.parse(response.data)

  return validatedData
}

export const getDescuentoFn = async (id: string) => {
  const response = await axiosInstance.get(`api/descuentos/${id}`)

  const validatedData = getDescuentoSchema.parse(response.data)

  return validatedData
}

export const createDescuentoFn = async (data: CreateDescuentoInputClient) => {
  const response = await axiosInstance.post(`api/descuentos`, data)

  return response.data
}

export const updateDescuentoFn = async (
  data: UpdateDescuentoInput & { id: string },
) => {
  const { id, ...rest } = data

  const response = await axiosInstance.patch(`api/descuentos/${id}`, rest)

  return response.data
}

export const deleteDescuentoFn = async (id: string) => {
  const response = await axiosInstance.delete(`api/descuentos/${id}`)

  return response.data
}
