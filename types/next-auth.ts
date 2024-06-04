import { Role } from "@prisma/client"
import { DefaultSession } from "next-auth"

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string
    id: string
    role: Role
    image?: string
  }
}

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"]
  }

  interface User {
    id: string
    role: Role
    image?: string
  }
}
