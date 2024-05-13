import { axiosInstance } from "@/lib/axios"
import { CreateCustomerInput } from "@/schemas/customer"

export const createCustomerFn = async (
  data: CreateCustomerInput & { horarioId: string; periodoCode: string },
) => {
  const { horarioId, periodoCode, ...rest } = data

  const response = await axiosInstance.post(
    `api/horarios/${horarioId}/periodos/${periodoCode}/addCustomer`,
    rest,
  )

  return response.data
}
