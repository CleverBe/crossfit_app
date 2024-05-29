import { getAsistenciasFn } from "@/services/asistencias"
import { useQuery } from "@tanstack/react-query"

export const useAsistencias = (planId: string) => {
  return useQuery({
    queryKey: ["asistencias", planId],
    queryFn: () => getAsistenciasFn(planId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
