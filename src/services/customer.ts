import { axiosInstance } from "@/lib/axios"
import {
  CreateCustomerOutput,
  getCustomerSchema,
  updateCustomerSchemaClientOutput,
} from "@/schemas/customer"

export const getCustomerFn = async (id: string) => {
  const response = await axiosInstance.get(`api/customers/${id}`)

  const validatedData = getCustomerSchema.parse(response.data)

  return validatedData
}

export const createCustomerFn = async (
  data: CreateCustomerOutput & { horarioId: string; periodoCode: string },
) => {
  const { horarioId, periodoCode, ...rest } = data

  const response = await axiosInstance.post(
    `api/horarios/${horarioId}/periodos/${periodoCode}/addCustomer`,
    rest,
  )

  return response.data
}

export const updateCustomerFn = async (
  data: updateCustomerSchemaClientOutput & { id: string },
) => {
  const { id, ...rest } = data

  const response = await axiosInstance.patch(`api/customers/${id}`, rest)

  return response.data
}
