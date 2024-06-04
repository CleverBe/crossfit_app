export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/users/:path*",
    "/instructores/:path*",
    "/horarios/:path*",
    "/tipoDePlanes/:path*",
    "/descuentos/:path*",
    "/customers/:path*",
  ],
}
