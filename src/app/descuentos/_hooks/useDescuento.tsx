import { getDescuentoFn } from "@/services/descuentos"
import { useQuery } from "@tanstack/react-query"

export const useDescuento = (id: string) => {
  return useQuery({
    queryKey: ["descuentos", id],
    queryFn: () => getDescuentoFn(id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
