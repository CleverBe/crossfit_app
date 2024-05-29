import { Dias, Horario } from "@prisma/client"
import { z } from "zod"
import dayjs from "dayjs"

export const sleep = async (miliseconds: number = 1000) => {
  await new Promise((resolve) => setTimeout(resolve, miliseconds))
}

export const compareTimes = (time1: string, time2: string) => {
  // Dividir las cadenas de hora y minutos
  const [hora1Str, minuto1Str] = time1.split(":")
  const [hora2Str, minuto2Str] = time2.split(":")

  // Convertir las cadenas en números enteros
  const hora1Int = parseInt(hora1Str, 10)
  const minuto1Int = parseInt(minuto1Str, 10)
  const hora2Int = parseInt(hora2Str, 10)
  const minuto2Int = parseInt(minuto2Str, 10)

  // Comparar las horas
  if (hora1Int < hora2Int) {
    return true
  } else if (hora1Int === hora2Int) {
    // Si las horas son iguales, comparar los minutos
    return minuto1Int < minuto2Int
  } else {
    return false
  }
}

export const checkForConflict = (
  horarios: Horario[],
  hora_inicio: string,
  hora_fin: string,
) => {
  // Verificar si el nuevo horario entra en conflicto con algún horario existente
  const conflicto = horarios.some((horario) => {
    // Convertir las cadenas de hora en objetos Date para facilitar la comparación
    const horaInicioExistente = new Date(`1970-01-01T${horario.hora_inicio}`)
    const horaFinExistente = new Date(`1970-01-01T${horario.hora_fin}`)
    const horaInicioNuevo = new Date(`1970-01-01T${hora_inicio}`)
    const horaFinNuevo = new Date(`1970-01-01T${hora_fin}`)

    // Verificar si el nuevo horario se superpone con algún horario existente
    return (
      (horaInicioNuevo >= horaInicioExistente &&
        horaInicioNuevo < horaFinExistente) ||
      (horaFinNuevo > horaInicioExistente &&
        horaFinNuevo <= horaFinExistente) ||
      (horaInicioNuevo <= horaInicioExistente &&
        horaFinNuevo >= horaFinExistente)
    )
  })

  return conflicto
}

export const getCurrentDateYYYYMMDD = () => {
  const date = new Date()

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")

  return `${year}-${month}-${day}`
}

export const getCurrentDateWithTime = () => {
  // Obtener la fecha y hora actual
  const now = new Date()

  // Extraer componentes de la fecha y hora
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0") // Los meses son base 0
  const day = String(now.getDate()).padStart(2, "0")
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const getCurrentPeriodoYYYYMM = () => {
  // Obtener la fecha actual
  const fechaActual = new Date()

  // Obtener el año y el mes
  const año = fechaActual.getFullYear()
  // El mes se devuelve en base 0 (enero es 0, febrero es 1, etc.), por lo que sumamos 1
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0")

  // Formatear en el formato deseado (YYYY-MM)
  return `${año}-${mes}`
}

export const getDifferenceInDays = (fecha1: string, fecha2: string) => {
  const date1 = dayjs(fecha2)

  return date1.diff(fecha1, "days")
}

export const sortDays = (days: Dias[]) => {
  days.sort((a, b) => {
    const diasOrden = [
      Dias.LUNES,
      Dias.MARTES,
      Dias.MIERCOLES,
      Dias.JUEVES,
      Dias.VIERNES,
      Dias.SABADO,
      Dias.DOMINGO,
    ]
    return diasOrden.indexOf(a) - diasOrden.indexOf(b)
  })

  return days
}

export const formatDays = (days: Dias[]) => {
  const diasOrdenados = sortDays(days)

  const formattedDays = diasOrdenados.map((day) => {
    switch (day) {
      case Dias.LUNES:
        return "L"
      case Dias.MARTES:
        return "M"
      case Dias.MIERCOLES:
        return "X"
      case Dias.JUEVES:
        return "J"
      case Dias.VIERNES:
        return "V"
      case Dias.SABADO:
        return "S"
      case Dias.DOMINGO:
        return "D"
      default:
        return ""
    }
  })

  return formattedDays.join(",")
}

export const checkTwoDates = ({
  dateInicial,
  dateFinal,
}: {
  dateInicial: string
  dateFinal: string
}) => {
  const validateDateSchema = z.object({
    date1: z.string().date(),
    date2: z.string().date(),
  })

  const validation = validateDateSchema.safeParse({
    date1: dateInicial,
    date2: dateFinal,
  })

  if (!validation.success) {
    return { result: false, message: "Invalid format" }
  }

  const { date1, date2 } = validation.data

  const dateInicio = new Date(date1)
  const dateFin = new Date(date2)

  if (dateInicio < dateFin) {
    return { result: true, message: "Date inicio is before date final" }
  } else {
    return { result: false, message: "Date inicio is after date final" }
  }
}
