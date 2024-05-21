import { getHorarioFn } from "@/services/horarios"
import { useQuery } from "@tanstack/react-query"

export const useHorario = (id: string) => {
  return useQuery({
    queryKey: ["horarios", id],
    queryFn: () => getHorarioFn(id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
