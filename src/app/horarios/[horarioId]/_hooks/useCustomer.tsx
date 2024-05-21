import { getCustomerFn } from "@/services/customer"
import { useQuery } from "@tanstack/react-query"

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => getCustomerFn(id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
