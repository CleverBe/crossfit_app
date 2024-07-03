import { axiosInstance } from "@/lib/axios"
import {
  CreateCustomerOutput,
  getCustomerPlansSchema,
  getCustomerSchema,
  updateCustomerSchemaClientOutput,
} from "@/schemas/customer"

export const getCustomersFn = async () => {
  const response = await axiosInstance.get(`api/customers`)

  const validatedData = getCustomerSchema.array().parse(response.data)

  return validatedData
}

export const getCustomerFn = async (id: string) => {
  const response = await axiosInstance.get(`api/customers/${id}`)

  const validatedData = getCustomerSchema.parse(response.data)

  return validatedData
}

export const getCustomerPlansFn = async (id: string) => {
  const response = await axiosInstance.get(`api/customers/${id}/plans`)

  const validatedData = getCustomerPlansSchema.parse(response.data)

  return validatedData
}

export const createCustomerFn = async (
  data: CreateCustomerOutput & { horarioId: string },
) => {
  const response = await axiosInstance.post(`api/planes`, data)

  return response.data
}

export const updateCustomerFn = async (
  data: updateCustomerSchemaClientOutput & { id: string },
) => {
  const { id, ...rest } = data

  const response = await axiosInstance.patch(`api/customers/${id}`, rest)

  return response.data
}
