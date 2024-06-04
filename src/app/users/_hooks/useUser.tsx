import { getUserFn } from "@/services/users"
import { useQuery } from "@tanstack/react-query"

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserFn(id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
