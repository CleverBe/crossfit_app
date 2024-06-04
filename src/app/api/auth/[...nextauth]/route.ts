import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prismadb from "@/lib/prismadb"
import bcrypt from "bcrypt"
import { NextAuthOptions } from "next-auth"
import { validateUserForJwtSchema } from "@/schemas/users"

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: ({ token, user, trigger, session }) => {
      if (trigger === "update") {
        const validation = validateUserForJwtSchema.safeParse(session)
        if (validation.success) {
          token.name = validation.data.nombre
          token.email = validation.data.email
          if (validation.data.role) {
            token.role = validation.data.role
          }
          if (validation.data.imagen) {
            token.image = validation.data.imagen
          }
        }
      }
      // The arguments user, account, profile and isNewUser are only passed the first time this callback is called on a new session
      if (user) {
        token.id = user.id
        token.role = user.role
        token.image = user.image
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      session.user.image = token.image

      return session
    },
  },
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
          include: { imagen: true },
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
          role: user.role,
          image: user.imagen?.secureUrl,
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
