import { axiosInstance } from "@/lib/axios"
import { getUserSchema } from "@/schemas/users"

export const getUserFn = async (id: string) => {
  const response = await axiosInstance.get(`api/users/${id}`)

  const validatedData = getUserSchema.parse(response.data)

  return validatedData
}

export const createUserFn = async (formData: FormData) => {
  const response = await axiosInstance.post(`api/users`, formData)

  return response.data
}

export const updateUserFn = async (formData: FormData) => {
  const id = formData.get("id")

  const response = await axiosInstance.patch(`api/users/${id}`, formData)

  return response.data
}

export const deleteUserFn = async (id: string) => {
  const response = await axiosInstance.delete(`api/users/${id}`)

  return response.data
}
