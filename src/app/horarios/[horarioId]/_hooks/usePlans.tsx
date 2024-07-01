import { getPlansFn } from "@/services/plan"
import { useQuery } from "@tanstack/react-query"

export const usePlans = (horarioPeriodoId: string) => {
  return useQuery({
    queryKey: ["planes", { horarioPeriodoId }],
    queryFn: () => getPlansFn({ horario_periodo_id: horarioPeriodoId }),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
