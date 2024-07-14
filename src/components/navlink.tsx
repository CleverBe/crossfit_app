import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Props {
  children: React.ReactNode
  navigateTo: string
  setShowNav: (value: boolean) => void
}

export const NavBarLink = ({ children, navigateTo, setShowNav }: Props) => {
  const pathname = usePathname()

  return (
    <Link
      href={navigateTo}
      onClick={() => {
        setShowNav(false)
      }}
      className={cn(
        "block border-b border-gray-100 py-2 pl-3 pr-4 text-gray-800 hover:bg-gray-200 hover:text-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:border-0 lg:p-0 lg:text-gray-400 lg:hover:bg-transparent lg:hover:text-gray-800 lg:dark:hover:bg-transparent lg:dark:hover:text-white",
        navigateTo.startsWith(pathname) &&
          "bg-gray-800 text-white hover:bg-gray-800 hover:text-white dark:text-white dark:hover:bg-gray-700 lg:bg-transparent lg:text-gray-900",
      )}
    >
      {children}
    </Link>
  )
}
