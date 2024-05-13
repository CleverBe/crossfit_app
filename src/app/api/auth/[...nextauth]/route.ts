import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prismadb from "@/lib/prismadb"
import bcrypt from "bcrypt"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "your-email@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await prismadb.usuario.findUnique({
          where: { email: credentials?.email },
        })

        if (!user) {
          throw new Error("Usuario no encontrado o contraseña incorrecta")
        }

        const mathPassword = await bcrypt.compare(
          credentials?.password || "",
          user.password,
        )

        if (!mathPassword) {
          throw new Error("Usuario no encontrado o contraseña incorrecta")
        }

        return {
          id: user.id,
          name: user.nombre,
          email: user.email,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as POST, handler as GET }
