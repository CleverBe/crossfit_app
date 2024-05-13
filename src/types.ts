import { Horario, HorarioPeriodo, Instructor } from "@prisma/client"

interface IssueApi {
  path: string | number
  message: string
}

export interface ApiErrorBackend {
  message?: string
  errors?: IssueApi[]
}

export type HorarioWithPeriodos = Horario & {
  horarioPeriodos: (HorarioPeriodo & {
    instructor: Instructor | null
  })[]
}
