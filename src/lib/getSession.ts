import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

export const getSessionServerSide = async () => {
  return await getServerSession(authOptions)
}
