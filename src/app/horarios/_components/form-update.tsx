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
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { handleGeneralErrors } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Estado } from "@prisma/client"
import {
  HorarioFromApi,
  UpdateHorarioInput,
  updateHorarioSchemaClient,
} from "@/schemas/horarios"
import { updateHorarioFn } from "@/services/horarios"

interface Props {
  horario: HorarioFromApi
  onClose: () => void
}

export const FormUpdate = ({ horario, onClose }: Props) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const form = useForm<UpdateHorarioInput>({
    resolver: zodResolver(updateHorarioSchemaClient),
    values: {
      hora_inicio: horario.hora_inicio,
      hora_fin: horario.hora_fin,
      estado: horario.estado,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateHorarioFn,
  })

  const onSubmit = async (values: UpdateHorarioInput) => {
    mutate(
      { id: horario.id, ...values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["horarios"] })
          form.reset()
          router.refresh()
          toast.success(`Horario actualizado.`)
          onClose()
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
      <form
        className="grid grid-cols-12 gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="hora_inicio"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Hora inicio</FormLabel>
              <FormControl>
                <Input type="time" placeholder="MyName" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hora_fin"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Hora Fin</FormLabel>
              <FormControl>
                <Input type="time" placeholder="MyName" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Estado</FormLabel>
              <Select
                disabled={form.formState.isSubmitting}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      defaultValue={field.value}
                      placeholder="Seleccione el estado"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Estado).map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-12 flex w-full items-center justify-end">
          <Button disabled={isPending} type="submit">
            Actualizar
          </Button>
        </div>
      </form>
    </Form>
  )
}

FormUpdate.Skeleton = function FormUpdateSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-6 space-y-2">
        <Label>Hora inicio</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-6 space-y-2">
        <Label>Hora fin</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-6 space-y-2">
        <Label>Estado</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-12 flex items-center justify-end">
        <Skeleton className="h-10 w-32 bg-neutral-200" />
      </div>
    </div>
  )
}
