import { getPlanFn } from "@/services/plan"
import { useQuery } from "@tanstack/react-query"

export const usePlan = (id: string) => {
  return useQuery({
    queryKey: ["planes", id],
    queryFn: () => getPlanFn(id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
