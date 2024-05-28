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
import { useDescuentoModalCreate } from "../_hooks/use-user-modal"
import {
  CreateDescuentoInputClient,
  createDescuentoSchemaClient,
} from "@/schemas/descuentos"
import { createDescuentoFn } from "@/services/descuentos"

export const FormCreate = () => {
  const router = useRouter()
  const modalCreate = useDescuentoModalCreate()

  const form = useForm<CreateDescuentoInputClient>({
    resolver: zodResolver(createDescuentoSchemaClient),
    defaultValues: {
      titulo: "",
      porcentaje: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createDescuentoFn,
  })

  const onSubmit: SubmitHandler<CreateDescuentoInputClient> = async (
    values,
  ) => {
    mutate(values, {
      onSuccess: () => {
        form.reset()
        router.refresh()
        toast.success(`Descuento created.`)
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
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titulo</FormLabel>
              <FormControl>
                <Input placeholder="Por pareja, por familiar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="porcentaje"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Porcentaje %</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full items-center justify-end">
          <Button disabled={isPending} type="submit">
            Crear
          </Button>
        </div>
      </form>
    </Form>
  )
}
