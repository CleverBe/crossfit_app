import { axiosInstance } from "@/lib/axios"
import { RegisterUserInputClient } from "@/schemas/auth"

export const signUpUserFn = async (user: RegisterUserInputClient) => {
  const { matchPwd, ...newUserData } = user

  const response = await axiosInstance.post("api/auth/register", newUserData)

  return response.data
}
