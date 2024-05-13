import { axiosInstance } from "@/lib/axios"
import {
  CreateTipoDePlanInputClient,
  FormattedTipoDePlan,
  UpdateTipoDePlanInput,
  getTipoDePlanSchema,
} from "@/schemas/tipoDePlanes"

export const getTipoDePlanFn = async (
  id: string,
): Promise<FormattedTipoDePlan> => {
  const response = await axiosInstance.get(`api/tiposDePlanes/${id}`)

  const validatedData = getTipoDePlanSchema.parse(response.data)

  const formattedDays = validatedData.dias.map((day) => {
    return {
      label: day,
      value: day,
    }
  })

  return { ...validatedData, dias: formattedDays }
}

export const createTipoDePlanFn = async (data: CreateTipoDePlanInputClient) => {
  const { dias, ...rest } = data

  const formattedDays = dias.map((day) => {
    return day.value
  })

  const response = await axiosInstance.post(`api/tiposDePlanes`, {
    ...rest,
    dias: formattedDays,
  })

  return response.data
}

export const updateTipoDePlanFn = async (
  data: UpdateTipoDePlanInput & { id: string },
) => {
  const { id, dias, ...rest } = data

  const formattedDays = dias.map((day) => {
    return day.value
  })

  const response = await axiosInstance.patch(`api/tiposDePlanes/${id}`, {
    ...rest,
    dias: formattedDays,
  })

  return response.data
}

export const deleteTipoDePlanFn = async (id: string) => {
  const response = await axiosInstance.delete(`api/tiposDePlanes/${id}`)

  return response.data
}
