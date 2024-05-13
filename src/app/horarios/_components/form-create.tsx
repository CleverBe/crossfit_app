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
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { handleGeneralErrors } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { useHorarioModalCreate } from "../_hooks/use-user-modal"
import {
  CreateHorarioInput,
  createHorarioSchemaClient,
} from "@/schemas/horarios"
import { createHorarioFn } from "@/services/horarios"

export const FormCreate = () => {
  const router = useRouter()
  const modalCreate = useHorarioModalCreate()

  const form = useForm<CreateHorarioInput>({
    resolver: zodResolver(createHorarioSchemaClient),
    values: {
      hora_inicio: "00:00",
      hora_fin: "00:00",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createHorarioFn,
  })

  const onSubmit: SubmitHandler<CreateHorarioInput> = async (values) => {
    mutate(values, {
      onSuccess: () => {
        form.reset()
        router.refresh()
        toast.success(`Horario created.`)
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
    })
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="hora_inicio"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel>Hora Fin</FormLabel>
              <FormControl>
                <Input type="time" placeholder="MyName" {...field} />
              </FormControl>
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
