import { axiosInstance } from "@/lib/axios"
import {
  CreateInstructorInput,
  UpdateInstructorInput,
  getInstructorSchema,
  getInstructoresSchema,
} from "@/schemas/instructores"
import { Estado } from "@prisma/client"

interface Props {
  estado?: Estado
}

export const getInstructoresFn = async ({ estado }: Props) => {
  const params = new URLSearchParams()

  if (estado) {
    params.append("estado", estado)
  }

  const response = await axiosInstance.get(`api/instructores`, { params })

  const validatedData = getInstructoresSchema.parse(response.data)

  return validatedData
}

export const getInstructorFn = async (id: string) => {
  const response = await axiosInstance.get(`api/instructores/${id}`)

  const validatedData = getInstructorSchema.parse(response.data)

  return validatedData
}

export const createInstructorFn = async (data: CreateInstructorInput) => {
  const response = await axiosInstance.post(`api/instructores`, data)

  return response.data
}

export const updateInstructorFn = async (
  data: UpdateInstructorInput & { id: string },
) => {
  const { id, ...rest } = data

  const response = await axiosInstance.patch(`api/instructores/${id}`, rest)

  return response.data
}

export const deleteInstructorFn = async (id: string) => {
  const response = await axiosInstance.delete(`api/instructores/${id}`)

  return response.data
}
