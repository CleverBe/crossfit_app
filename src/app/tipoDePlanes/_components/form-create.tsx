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
import { useTipoDePlanModalCreate } from "../_hooks/use-user-modal"
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
        toast.success(`TipoDePlan created.`)
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
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <Input placeholder="Completo, Básico" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dias</FormLabel>
              <MultiSelect
                searchInput={false}
                selected={field.value}
                options={options}
                placeholder="Select the dias"
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
            <FormItem>
              <FormLabel>Costo en bs</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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
