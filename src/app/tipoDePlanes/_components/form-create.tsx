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
import { useTipoDePlanModalCreate } from "../_hooks/useTipoDePlanModal"
import {
  CreateTipoDePlanInputClient,
  createTipoDePlanSchemaClient,
} from "@/schemas/tipoDePlanes"
import { createTipoDePlanFn } from "@/services/tipoDePlanes"
import { Dias } from "@prisma/client"
import { MultiSelect, OptionType } from "@/components/ui/multiselect"

export const FormCreate = () => {
  const router = useRouter()
  const modalCreate = useTipoDePlanModalCreate()

  const form = useForm<CreateTipoDePlanInputClient>({
    resolver: zodResolver(createTipoDePlanSchemaClient),
    defaultValues: {
      tipo: "",
      dias: [],
      costo: "",
      cantidadDeClases: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createTipoDePlanFn,
  })

  const onSubmit: SubmitHandler<CreateTipoDePlanInputClient> = async (
    values,
  ) => {
    mutate(values, {
      onSuccess: () => {
        form.reset()
        router.refresh()
        toast.success(`Tipo de plan creado.`)
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

  const options: OptionType[] = Object.values(Dias).map((dia) => ({
    label: dia,
    value: dia,
  }))

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-12 gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem className="col-span-12">
              <FormLabel>Nombre del plan</FormLabel>
              <FormControl>
                <Input placeholder="Completo, normal, etc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dias"
          render={({ field }) => (
            <FormItem className="col-span-12">
              <FormLabel>Dias</FormLabel>
              <MultiSelect
                searchInput={false}
                selected={field.value}
                options={options}
                placeholder="Seleccione los dias"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="costo"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Costo en Bs</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cantidadDeClases"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Cantidad de clases</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-12 flex w-full items-center justify-end">
          <Button disabled={isPending} type="submit">
            Crear
          </Button>
        </div>
      </form>
    </Form>
  )
}
