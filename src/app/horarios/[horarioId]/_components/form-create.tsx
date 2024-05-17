"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { handleGeneralErrors } from "@/lib/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useHorarioPeriodoModalCreate } from "../_hooks/useHorarioPeriodoModal"
import {
  CreatePeriodoInput,
  createPeriodoSchemaClient,
} from "@/schemas/periodos"
import { createPeriodoFn } from "@/services/periodos"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getInstructoresFn } from "@/services/instructores"
import { getCurrentPeriodoYYYYMM } from "@/utils"

interface Props {
  changePeriodoFiltro: (newValue: string | null) => void
}

export const FormCreate = ({ changePeriodoFiltro }: Props) => {
  const router = useRouter()
  const params = useParams<{ horarioId: string }>()

  const modalCreate = useHorarioPeriodoModalCreate()

  const { data: instructores } = useQuery({
    queryKey: ["instructores"],
    queryFn: getInstructoresFn,
  })

  const periodoActual = getCurrentPeriodoYYYYMM()

  const form = useForm<CreatePeriodoInput>({
    resolver: zodResolver(createPeriodoSchemaClient),
    values: {
      periodo: periodoActual,
      instructor: "unassigned",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createPeriodoFn,
  })

  const onSubmit: SubmitHandler<CreatePeriodoInput> = async (values) => {
    mutate(
      { horarioId: params.horarioId, ...values },
      {
        onSuccess: () => {
          form.reset()

          router.refresh()
          changePeriodoFiltro(values.periodo)
          toast.success(`Periodo created.`)

          modalCreate.onClose()
        },
        onError: (err: unknown) => {
          const errorMessage = handleGeneralErrors(err)

          if (Array.isArray(errorMessage)) {
            errorMessage.forEach((error) => {
              toast.error(error.message)
            })
          } else {
            toast.error(errorMessage)
          }
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="periodo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Periodo</FormLabel>
              <FormControl>
                <Input type="month" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructor</FormLabel>
              <Select
                disabled={isPending}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      defaultValue={field.value}
                      placeholder="Seleccione un instructor"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unassigned">Sin asignar</SelectItem>
                  {instructores?.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.nombre + " " + instructor.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full items-center justify-end">
          <Button disabled={isPending} type="submit">
            Create
          </Button>
        </div>
      </form>
    </Form>
  )
}
