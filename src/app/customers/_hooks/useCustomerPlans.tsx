import { getCustomerPlansFn } from "@/services/customer"
import { useQuery } from "@tanstack/react-query"

export const useCustomerPlans = (id: string) => {
  return useQuery({
    queryKey: ["customerPlans", id],
    queryFn: () => getCustomerPlansFn(id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
