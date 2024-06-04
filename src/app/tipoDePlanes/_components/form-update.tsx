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
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { handleGeneralErrors } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dias } from "@prisma/client"
import {
  FormattedTipoDePlan,
  UpdateTipoDePlanInput,
  updateTipoDePlanSchemaClient,
} from "@/schemas/tipoDePlanes"
import { updateTipoDePlanFn } from "@/services/tipoDePlanes"
import { MultiSelect, OptionType } from "@/components/ui/multiselect"

interface Props {
  tipoDePlan: FormattedTipoDePlan
  onClose: () => void
}

export const FormUpdate = ({ tipoDePlan, onClose }: Props) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const options: OptionType[] = Object.values(Dias).map((dia) => ({
    label: dia,
    value: dia,
  }))

  const form = useForm<UpdateTipoDePlanInput>({
    resolver: zodResolver(updateTipoDePlanSchemaClient),
    values: {
      tipo: tipoDePlan.tipo,
      dias: tipoDePlan.dias,
      costo: tipoDePlan.costo,
      cantidadDeClases: tipoDePlan.cantidadDeClases,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateTipoDePlanFn,
  })

  const onSubmit = async (values: UpdateTipoDePlanInput) => {
    mutate(
      { id: tipoDePlan.id, ...values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["tiposDePlanes"] })
          form.reset()
          router.refresh()
          toast.success(`Tipo de plan actualizado.`)
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
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del plan</FormLabel>
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
        <FormField
          control={form.control}
          name="cantidadDeClases"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad de clases</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full items-center justify-end">
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nombre del plan</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="space-y-2">
        <Label>Dias</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="space-y-2">
        <Label>Costo</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="space-y-2">
        <Label>Cantidad de clases</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="flex items-center justify-end">
        <Skeleton className="h-10 w-32 bg-neutral-200" />
      </div>
    </div>
  )
}
