import { getPlanFn } from "@/services/plan"
import { useQuery } from "@tanstack/react-query"

export const usePlan = (id: string) => {
  return useQuery({
    queryKey: ["plans", id],
    queryFn: () => getPlanFn(id),
  })
}
