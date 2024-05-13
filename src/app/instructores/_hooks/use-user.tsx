import { getInstructorFn } from "@/services/instructores"
import { useQuery } from "@tanstack/react-query"

export const useInstructor = (id: string) => {
  return useQuery({
    queryKey: ["instructores", id],
    queryFn: () => getInstructorFn(id),
  })
}
