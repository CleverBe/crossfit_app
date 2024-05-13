import { Horario } from "@prisma/client"

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
