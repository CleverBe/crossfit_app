"use client"

import Link from "next/link"
import { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { AlignJustify } from "lucide-react"
import { NavBarLink } from "./navlink"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Separator } from "./ui/separator"

export const Header = () => {
  const [showNav, setShowNav] = useState(false)
  const [userMenu, setUserMenu] = useState(false)

  const { data: session, status } = useSession()

  const changeShowNav = (newState: boolean) => {
    setShowNav(newState)
  }

  const routes = [
    { label: "Usuarios", href: "/users" },
    { label: "Instructores", href: "/instructores" },
    { label: "Horarios", href: "/horarios" },
    { label: "Tipos de planes", href: "/tipoDePlanes" },
    { label: "Descuentos", href: "/descuentos" },
    { label: "Asistencias", href: "/asistencias" },
  ]

  return (
    <header className="border-gray-200 p-3 lg:px-6">
      <nav className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between gap-x-1">
        <Link href="/" className="flex items-center">
          <svg
            className="mr-2 size-5 fill-current md:size-6 lg:size-8"
            width="54"
            height="54"
            viewBox="0 0 54 54"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
          </svg>
          <span className="text-base font-semibold tracking-tight md:text-lg lg:text-xl">
            Crossfit App
          </span>
        </Link>

        <div className="flex items-center gap-x-2 lg:order-2">
          <ThemeToggle />
          {session?.user && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 rounded-full"
                  onClick={() => {
                    setUserMenu(!userMenu)
                  }}
                >
                  <span className="sr-only">Open user menu</span>
                  <Image
                    width={60}
                    height={60}
                    className="size-8 rounded-full"
                    src="https://res.cloudinary.com/dldf8bt5g/image/upload/v1686697003/Users/default_user_jr8kfs.png"
                    alt="user photo"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="center" className="mx-1 w-64">
                <div className="px-1 py-2">
                  <span
                    title={`${session.user.name}`}
                    className="block truncate text-xl text-gray-900 dark:text-white"
                  >
                    {session.user.name}
                  </span>
                  <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                    {session.user.email}
                  </span>
                </div>
                <Separator />
                <ul className="space-y-2 pt-2">
                  <li>
                    <button
                      className="flex w-full justify-start rounded-lg px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => {
                        signOut()
                      }}
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
          )}
          <Button
            variant="default"
            size="icon"
            className="lg:hidden"
            onClick={() => {
              changeShowNav(!showNav)
            }}
          >
            <AlignJustify />
          </Button>
        </div>

        <div
          className={cn(
            "w-full flex-grow px-5 lg:order-1 lg:flex lg:w-auto lg:items-center",
            !showNav && "hidden",
          )}
        >
          {session ? (
            <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
              {routes.map((route) => (
                <li key={route.href}>
                  <NavBarLink
                    navigateTo={route.href}
                    setShowNav={changeShowNav}
                  >
                    {route.label}
                  </NavBarLink>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
              <li>
                <NavBarLink navigateTo="/login" setShowNav={changeShowNav}>
                  Login
                </NavBarLink>
              </li>
              <li>
                <NavBarLink navigateTo="/register" setShowNav={changeShowNav}>
                  Register
                </NavBarLink>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  )
}
