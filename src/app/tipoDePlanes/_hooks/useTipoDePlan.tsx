import { getTipoDePlanFn } from "@/services/tipoDePlanes"
import { useQuery } from "@tanstack/react-query"

export const useTipoDePlan = (id: string) => {
  return useQuery({
    queryKey: ["tiposDePlanes", id],
    queryFn: () => getTipoDePlanFn(id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
