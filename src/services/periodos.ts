import { axiosInstance } from "@/lib/axios"
import { CreatePeriodoInput } from "@/schemas/periodos"

export const getPeriodoFn = async ({
  horarioId,
  periodoCode,
}: {
  horarioId: string
  periodoCode: string
}) => {
  const response = await axiosInstance.get(
    `api/horarios/${horarioId}/periodos/${periodoCode}`,
  )

  return response.data
}

export const createPeriodoFn = async (
  data: CreatePeriodoInput & { horarioId: string },
) => {
  const { horarioId, ...rest } = data

  const response = await axiosInstance.post(
    `api/horarios/${horarioId}/periodos`,
    rest,
  )

  return response.data
}

export const assignInstructoToPeriodoFn = async (data: {
  horarioId: string
  periodoCode: string
  instructorId: string
}) => {
  const { instructorId, horarioId, periodoCode } = data

  const response = await axiosInstance.patch(
    `api/horarios/${horarioId}/periodos/${periodoCode}`,
    { instructorId },
  )

  return response.data
}
